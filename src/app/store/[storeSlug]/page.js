import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import StoreContent from "./StoreContent";

async function getStoreBySlug(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/public/store?slug=${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      console.error("Failed to fetch store data:", res.statusText);
      return null;
    }
    let data = await res.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error("Error fetching store:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const store = await getStoreBySlug(resolvedParams.storeSlug);
  
  if (!store) {
    return {
      title: "Store Not Found",
      description: "The requested store could not be found."
    };
  }

  return {
    title: `${store.storeName} - Shop Online`,
    description: store.description || `Welcome to ${store.storeName}'s store`,
    openGraph: {
      title: store.storeName,
      description: store.description,
      images: store.logo ? [store.logo] : [],
    },
  };
}

export default async function PublicStorePage({ params }) {
  const resolvedParams = await params;
  const storeSlug = resolvedParams.storeSlug;
  
  const storeData = await getStoreBySlug(storeSlug);
  
  if (!storeData) {
    notFound();
  }

  return <StoreContent storeData={storeData} storeSlug={storeSlug} />;
}