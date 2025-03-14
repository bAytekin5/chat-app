import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message: string) => {
		if (!selectedConversation) {
			toast.error("Lütfen önce bir sohbet seçin.");
			return;
		}

		if (!message.trim()) {
			toast.error("Boş mesaj gönderemezsiniz.");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch(`/api/messages/send/${selectedConversation.id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message }),
			});

			if (!res.ok) {
				throw new Error(`Mesaj gönderilemedi. Hata kodu: ${res.status}`);
			}

			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);
			toast.success("Mesaj başarıyla gönderildi."); 
		} catch (error: any) {
			console.error("Mesaj gönderme hatası:", error);
			toast.error(error.message || "Mesaj gönderirken bir hata oluştu. Lütfen tekrar deneyin.");
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};

export default useSendMessage;
