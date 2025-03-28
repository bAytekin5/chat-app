import MessageInput from "./MessageInput.tsx";
import Messages from "./Messages.tsx";
import useConversation from "../../zustand/useConversation.ts";
import { useAuthContext } from "../../context/AuthContext.tsx";
import { MessageCircle } from "lucide-react";




const MessageContainer = () => {
  const { selectedConversation } = useConversation();
  return (
    <div className="w-full flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
 
          <div className="bg-slate-500 px-4 py-2 mb-2">
            <span className="label-text">Kime: </span>{" "}
            <span className="text-gray-900 font-bold"> {selectedConversation.fullname} </span>
          </div>

          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};
export default MessageContainer;

 const NoChatSelected = () => {
  const { authUser } = useAuthContext();
return (
     <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Hoşgeldiniz 👋 {authUser?.fullname} </p>
         <p>Mesajlaşmaya başlamak için bir sohbet seçin</p>
        <MessageCircle className="text-3xl md:text-6xl text-center" />
       </div>
    </div>
   );
 };
