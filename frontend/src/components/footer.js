import packageJson from "../../package.json";

const Footer = () => {
    return (
      <div className="bg-cyan-600 text-white text-center py-2 bottom-0 w-full">
        <div className="flex flex-row justify-between items-center">
            <p className="mx-auto  text-cyan-300">&copy;Esteem Infrastructure Pvt Ltd, 2024. All rights reserved.</p>
            {/* <span className="text-sm text-gray-700 mx-4">Version {packageJson.version}</span> */}
        </div> 
      </div>
    );
  };

  export default Footer;