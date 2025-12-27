import Link from 'next/link';
export default function NotFound() {
    return (<div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-muted-foreground mb-6">Could not find requested resource</p>
            <Link href="/" className="text-primary hover:underline">
                Return Home
            </Link>
        </div>);
}
