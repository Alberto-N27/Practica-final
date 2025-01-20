import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h1>404 - Página no encontrada</h1>
      <Link href="/">Volver a la página principal</Link>
    </div>
  );
}