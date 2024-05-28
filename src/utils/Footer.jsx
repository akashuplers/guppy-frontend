
const Footer = ({ className }) => {
  return (
    <div className={`absolute bottom-2 md:bottom-4 left-0 right-0 text-center text-blue-600 underline ${className}`}>
      <a href="https://nowigence.com" target="_blank">Powered By Nowigence AI</a>
    </div>
  );
};

export default Footer;
