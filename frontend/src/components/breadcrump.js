
import { Link } from 'react-router-dom';

const Breadcrumb = ({ crumbs }) => {
    const validCrumbs = crumbs.filter(crumb => crumb.path);

    return (
        <nav aria-label="breadcrumb">
          <ol className="flex space-x-2 text-gray-900 text-sm font-bold sm:mt-32">
            {validCrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {index === validCrumbs.length - 1 ? (
                  <span className="text-cyan-400 underline">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-gray-500 font-bold">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      );
};

export default Breadcrumb;
