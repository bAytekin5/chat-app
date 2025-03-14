import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?.id) return; 

      setLoading(true);
      setMessages([]);

      try {
        const res = await fetch(`/api/messages/${selectedConversation.id}`);

        if (!res.ok) {
          throw new Error(`Mesajlar alınamadı. Hata kodu: ${res.status}`);
        }

        const data = await res.json();
        setMessages(data);
      } catch (error: any) {
        console.error("Mesajları çekerken hata oluştu:", error);
        toast.error(error.message || "Mesajları alırken bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
