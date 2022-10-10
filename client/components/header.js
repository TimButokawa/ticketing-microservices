import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/sign-up' },
    !currentUser && { label: 'Sign In', href: '/auth/sign-in' },
    !!currentUser && { label: 'Sign Out', href: '/auth/sign-out' },
  ]
  .filter(linkConfig => linkConfig)
  .map(({ label, href}) => (
    <li key={href} aria-label={`link to ${label}`}>
      <Link href={href} >
        <a className="nav-link">{label}</a>
      </Link>
    </li>
  ));

  return (
    <nav className="navbar navbar-light bg-light p-2 mb-2">
      <Link href="/">
        <a className="navbar-brand">Tickets Please</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
