import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("API isteği yapılıyor...");
        const res = await fetch("/api/messages/conversations");

        if (!res.ok) {
          throw new Error(`Hata: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setConversations(data);
      } catch (error: any) {
        console.error("API isteğinde hata oluştu:", error);
        setError(error.message);
        toast.error(
          error.message ||
            "Sohbetleri alırken bir hata oluştu. Lütfen tekrar deneyin."
        );
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations, error };
};

export default useGetConversations;
