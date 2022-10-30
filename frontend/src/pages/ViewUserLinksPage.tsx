import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../utils/api";

type Link = {
  id: number;
  label: string;
  pivot: {
    page_id: number;
    link_id: number;
    url_address: string;
  };
};

type UserPage = {
  name: string;
  links: Link[];
};

export default function ViewUserLinksPage() {
  const { pageName } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [isReloadButtonVisible, setReloadButtonVisible] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [userPage, setUserPage] = useState<null | UserPage>(null);

  useEffect(() => {
    fetchUserLinks();
  }, []);

  const fetchUserLinks = async () => {
    setLoading(true);
    setReloadButtonVisible(false);

    try {
      const { data } = await api.get(`api/pages/${pageName}`);

      const parsedLinks = data.links.map((link: Link) => {
        const hasHttpProtocol = link.pivot.url_address.indexOf("http") === 0;

        if (!hasHttpProtocol) {
          link.pivot.url_address = `https://${link.pivot.url_address}`;
        }

        return link;
      });

      setUserPage({
        ...data,
        links: parsedLinks,
      });
    } catch (error: any) {
      if (error?.response?.status) {
        setErrorText("Sorry, this link is invalid.");
      } else {
        setErrorText(
          "Sorry, an error occurred, please check your connection and try again."
        );
        setReloadButtonVisible(true);
      }
    }

    setLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (errorText) {
    return (
      <div className="card bg-red-600 flex flex-col items-start gap-2">
        {errorText}
        {isReloadButtonVisible && (
          <button
            onClick={() => fetchUserLinks()}
            type="button"
            className="flex-1 bg-teal-600"
          >
            Reload
          </button>
        )}
      </div>
    );
  }

  const renderUserLinks = userPage?.links.map((link) => {
    return (
      <a
        key={link.id}
        href={link.pivot.url_address}
        target="_blank"
        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          {link.label}
        </span>
      </a>
    );
  });

  return (
    <div className="card flex flex-col items-center gap-4">
      <h1 className="text-xl">
        Hello, my name is&nbsp;
        <b>{`${pageName?.charAt(0).toUpperCase()}${pageName?.slice(1)}`}</b>.
      </h1>
      <div className="flex gap-2">{renderUserLinks}</div>
    </div>
  );
}
