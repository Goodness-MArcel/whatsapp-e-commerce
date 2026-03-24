import { NextResponse } from "next/server";
import { Order } from "@/models";

export async function POST(req) {
  try {
    const payload = await req.json();

    console.log("Received order payload:", payload);

    const formattedOrder = {
      storeId: payload.store.id,
      orderNumber: `ORD-${Date.now()}`,
      customerName: payload.user.fullName,
      customerEmail: payload.user.email,
      customerPhone: payload.user.phone,
      shippingAddress: {
        address: payload.user.address,
        city: payload.user.city,
        notes: payload.user.notes,
      },
      items: payload.items,
      subtotal: payload.total,
      tax: 0,
      total: payload.total,
      status: "pending",
      paymentStatus: "pending",
      placedAt: payload.orderDate,
    };

    console.log("Formatted order:", formattedOrder);

    const createdOrder = await Order.create(formattedOrder);
    console.log("Order created with ID:", createdOrder.id);

    // Get the app URL from environment or use default
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   (process.env.NODE_ENV === 'production' 
                     ? 'https://yourdomain.com' 
                     : 'http://localhost:3000');

    // Initialize Paystack payment
    const paymentPayload = {
      email: formattedOrder.customerEmail,
      amount: Math.round(formattedOrder.total * 100), // Convert to kobo/cents
      reference: formattedOrder.orderNumber,
      callback_url: `${appUrl}/payment-success`,
      metadata: {
        orderId: createdOrder.id,
        orderNumber: formattedOrder.orderNumber,
        customerName: formattedOrder.customerName,
        customerPhone: formattedOrder.customerPhone,
      },
    };

    console.log("Payment payload:", paymentPayload);

    const paymentRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentPayload),
      }
    );

    const paymentData = await paymentRes.json();
    console.log("Paystack response:", paymentData);

    // Check if Paystack initialization was successful
    if (!paymentData.status) {
      console.error("Paystack error:", paymentData.message);
      return NextResponse.json(
        { 
          message: "Payment initialization failed", 
          error: paymentData.message 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Order created",
      order: createdOrder,
      paymentUrl: paymentData.data.authorization_url,
      reference: formattedOrder.orderNumber,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      { message: "Failed to create order", error: error.message },
      { status: 500 }
    );
  }
}

// Payment verification endpoint
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { message: "Reference is required" },
        { status: 400 }
      );
    }

    console.log("Verifying payment for reference:", reference);

    // Verify payment with Paystack
    const verificationRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verificationData = await verificationRes.json();
    console.log("Verification response:", verificationData);

    if (!verificationData.status) {
      return NextResponse.json(
        { message: "Payment verification failed", error: verificationData.message },
        { status: 400 }
      );
    }

    if (verificationData.data.status !== "success") {
      return NextResponse.json(
        { message: "Payment not successful", status: verificationData.data.status },
        { status: 400 }
      );
    }

    // Update order status based on payment verification
    const order = await Order.findOne({
      where: { orderNumber: verificationData.data.reference },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Update order with payment details
    await order.update({
      paymentStatus: "paid",
      status: "processing",
      paymentDetails: {
        transactionId: verificationData.data.id,
        amount: verificationData.data.amount / 100,
        currency: verificationData.data.currency,
        paidAt: verificationData.data.paid_at,
        channel: verificationData.data.channel,
        authorizationCode: verificationData.data.authorization?.authorization_code,
        cardType: verificationData.data.authorization?.card_type,
        lastFour: verificationData.data.authorization?.last4,
      },
    });

    return NextResponse.json({
      message: "Payment verified successfully",
      order: order,
      payment: verificationData.data,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      { message: "Failed to verify payment", error: error.message },
      { status: 500 }
    );
  }
}