export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="pt-20">
            {children}
            <div className='h-20' />
        </section>
    )
}