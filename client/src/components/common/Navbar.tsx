import Logo from '../../assets/images/logo/logo.svg';
import SearchBar from '../searchBar/SearchBar';

const Navbar = () => {
  return (
    <header className='w-full h-[87px] shadow-[0px_2px_16px_0px_#0000001A]'>
      <nav className='max-w-7xl mx-auto h-full flex justify-between items-center'>
        <div className='w-[100px] h-[55px]'>
            <img src={Logo} alt='logo' className='w-full h-full'/>
        </div>
        <SearchBar />
      </nav>
    </header>
    
  )
}

export default Navbar