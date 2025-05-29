import type { Metadata } from 'next';
import { Button } from '@/components/button';
import "./download.css"

export const metadata: Metadata = {
  title: 'Play Now',
};

export default function Download() {
  return (
    <>
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="header">Play Now</h1>

      <div className="buttonGroup">
        <Button href='' variant='primary' className='vrGame'>Local Download</Button>
        <Button href='' variant='primary' className='vrGame'>Steam (Coming Soon)</Button>
        <Button href='https://changelingvrteam.itch.io/changelingvr' variant='primary' className='vrGame'>ITCH.io</Button>
      </div>
    </div>
    </>
  );
}
