import Hero from '../../components/Hero';
import Topbar from '../../components/topbar';

export default function Home() {
    return (
        <div className='h-full w-full flex flex-col'>
            <Topbar />
            <Hero />
        </div>
    )
}