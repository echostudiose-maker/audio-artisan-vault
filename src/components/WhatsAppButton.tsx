import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export function WhatsAppButton({ 
  phoneNumber = "5561981197287", 
  message = "Olá! Preciso de ajuda com a Echo Sound." 
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20BA5C] shadow-lg transition-all hover:scale-110"
      size="icon"
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </Button>
  );
}
