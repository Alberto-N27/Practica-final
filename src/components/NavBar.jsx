import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/clients">Clientes</Link>
        </li>
        <li>
          <Link href="/projects">Proyectos</Link>
        </li>
        <li>
          <Link href="/delivery-notes">Albaranes</Link>
        </li>
      </ul>
    </nav>
  );
}