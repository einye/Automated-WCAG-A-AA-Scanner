export default function WebsiteScanContent({children}) {
    return(
        <div className={` 
        ${'pt-4 w-full h-full bg-blue-50 bg-opacity-60'}
        ${'flex flex-col items-center gap-10'}
        ${'px-14'}
        `}>
            {children}
        </div>
    )
}