import Link from 'next/link';

export default function NewsroomPage() {
  return (
    <div>
      view + edit + create news for{' '}
      <Link href="/newsroom" className="text-blue-500">
        /newsroom
      </Link>
    </div>
  );
}
