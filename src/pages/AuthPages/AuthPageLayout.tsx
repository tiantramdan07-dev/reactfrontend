import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-gray-500 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/AiScale/" className="block mb-4">
            <img
              src="images/logo/logoimiwarna1.png"
              alt="Logo Light"
              className="w-24 h-24 object-contain block dark:hidden"
            />
            <img
              src="images/logo/logoimiputih.png"
              alt="Logo Dark"
              className="w-24 h-24 object-contain hidden dark:block"
            />
              </Link>
              <p className="text-center text-gray-100 dark:text-white/80 whitespace-nowrap text-lg font-semibold">
                PT INTERSKALA MANDIRI INDONESIA
              </p>
              <p className="text-center text-gray-200 dark:text-white/60 whitespace-nowrap text-sm italic">
                Importer | Distributor | Manufacturer Scale
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
