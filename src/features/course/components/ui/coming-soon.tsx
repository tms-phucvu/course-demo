import { ClockFading } from "lucide-react";

interface ComingSoonProps {
  feature: string;
}

export default function ComingSoon({ feature }: ComingSoonProps) {
  return (
    <div className='flex flex-col items-center p-6 text-center'>
      <div className='bg-muted mb-4 rounded-2xl p-4'>
        <ClockFading className='h-8 w-8' />
      </div>
      <h2 className='text-xl font-bold text-gray-500'>
        {feature} feature is coming soon
      </h2>
      <p className='mt-2 text-gray-500'>
        We will bring you the best experience soon. Thank you for your patience!
      </p>
    </div>
  );
}
