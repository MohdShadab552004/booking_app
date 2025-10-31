import Logo from '../../assets/images/logo/logo.svg';
import SearchBar from '../ui/SearchBar';

const Navbar = () => {
  return (
    <header className="w-full shadow-[0px_2px_16px_0px_#0000001A] bg-white">
      <nav
        className="
          max-w-7xl mx-auto px-4 py-3 
          flex flex-col sm:flex-row justify-between items-center 
          gap-4 sm:gap-0
        "
      >
        {/* Logo */}
        <div className="w-[100px] h-[55px] flex-shrink-0">
          <img src={Logo} alt="logo" className="w-full h-full object-contain" />
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <SearchBar />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
