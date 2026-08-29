import Image from "next/image";
import Link from "next/link";

export default function Logo({ light = false, className = "" }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      {light ? (
        <Image
          src="/logo-white.png"
          alt="KOVA Compounds"
          width={708}
          height={549}
          className="h-12 w-auto"
        />
      ) : (
        <Image
          src="/logo.png"
          alt="KOVA Compounds"
          width={708}
          height={549}
          priority
          className="h-14 w-auto"
        />
      )}
    </Link>
  );
}
