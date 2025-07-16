import Hero from '../../components/Hero';
import Topbar from '../../components/topbar';

export default function Blog() {
    return (
        <div className='h-full w-full flex flex-col'>
            <Topbar />
            <Hero />
        </div>
    )
}