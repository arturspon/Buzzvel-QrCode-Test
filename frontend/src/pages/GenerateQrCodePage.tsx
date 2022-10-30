import { useEffect, useState } from "react";
import api from "../utils/api";
import "../App.css";
import "../index.css";
import { useForm } from "react-hook-form";
import QrCode from "../components/QrCode";
import LoadingSpinner from "../components/LoadingSpinner";

type LinkType = {
  id: number;
  label: string;
};

type LinkUrl = {
  label: string;
  link_id: number;
  url_address: string;
};

type FormValues = {
  name: string;
  links: LinkUrl[];
};

export default function GenerateQrCodePage() {
  const [isLoading, setLoading] = useState(true);
  const [isCreatingPage, setCreatingPage] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState<string | null>(
    null
  );
  const [linkUrls, setLinkUrls] = useState<LinkUrl[]>([]);
  const [qrcodeValue, setQrcodeValue] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const { data } = await api.get("api/links");

    const links = data.map((link: LinkType) => {
      return {
        link_id: link.id,
        label: link.label,
        url_address: "",
      };
    });

    setLinkUrls(links);
    setLoading(false);
  };

  const resetForm = () => {
    reset();
    setQrcodeValue(null);
  };

  const createPage = async (data: FormValues) => {
    const links = data.links.reduce((carry, link, index) => {
      const linkData = linkUrls[index];

      if (link.url_address.trim().length) {
        carry.push({
          link_id: linkData.link_id,
          url_address: link.url_address,
        });
      }

      return carry;
    }, [] as { link_id: number; url_address: string }[]);

    if (!links.length) {
      setGeneralErrorMessage("Please fill at least one link.");
      return;
    }

    setCreatingPage(true);
    setGeneralErrorMessage(null);

    const postData = {
      name: data.name.toLowerCase(),
      links,
    };

    try {
      const { data } = await api.post("api/pages", postData);
      setQrcodeValue(`${window.location.origin}/${data.name}`);
    } catch (error: any) {
      if (
        error.response?.status == 500 ||
        !error.isAxiosError ||
        typeof error.response?.data != "object"
      ) {
        setGeneralErrorMessage(
          "An error occurred, please check your connection and try again."
        );
        setCreatingPage(false);
        return;
      }

      Object.entries(error.response.data).forEach(
        ([fieldName, errorList]: any) => {
          setError(fieldName, {
            message: errorList[0],
          });
        }
      );
    }

    setCreatingPage(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderLinks = linkUrls.map((link, index) => {
    return (
      <div key={link.link_id}>
        <label htmlFor={`link_${link.link_id}`}>{link.label}</label>
        <input
          id={`link_${link.link_id}`}
          type="text"
          placeholder="https://..."
          autoComplete="off"
          {...register(`links.${index}.url_address` as const, {
            pattern: /^((?:https?:\/\/)?[^./]+(?:\.[^./]+)+(?:\/.*)?)$/,
          })}
        />
        {errors?.links?.[index] && (
          <small className="text-red-500 ml-2">Invalid URL.</small>
        )}
      </div>
    );
  });

  const renderForm = () => {
    return (
      <>
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className="lowercase"
              autoComplete="off"
              type="text"
              maxLength={255}
              placeholder="Example: john.doe"
              {...register("name", {
                required: true,
                pattern: /^[a-zA-Z0-9_.-]*$/,
              })}
            />
            {errors.name?.type == "required" && (
              <small className="text-red-500 ml-2">Name is required.</small>
            )}
            {errors.name?.type == "pattern" && (
              <small className="text-red-500 ml-2">
                The name must not contain spaces or special symbols.
              </small>
            )}
            {errors.name?.message && (
              <small className="text-red-500 ml-2">
                {errors.name?.message}
              </small>
            )}
          </div>
          {renderLinks}
        </div>

        {generalErrorMessage && (
          <div className="card bg-red-800">{generalErrorMessage}</div>
        )}

        <button
          type="submit"
          className="mb-2 bg-green-600 hover:bg-green-700 focus:ring-green-800"
          disabled={isCreatingPage}
        >
          {isCreatingPage ? "Hold on..." : "Generate Image"}
        </button>
      </>
    );
  };

  return (
    <form
      onSubmit={handleSubmit((data) => createPage(data))}
      className="card flex flex-col gap-5"
    >
      <h1 className="text-3xl font-bold">Buzzvel</h1>
      <hr />
      {qrcodeValue ? (
        <QrCode qrcodeValue={qrcodeValue} resetForm={resetForm} />
      ) : (
        renderForm()
      )}
    </form>
  );
}
