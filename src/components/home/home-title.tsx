import Link from "next/link";

export default function HomeTitle() {
    return(
    <>
        <div id="home-title">
            <h1>Discover what drives you.</h1>
        </div>
        <div id="home-buttons">
            <Link href="/projects" id="view-projects" className="home-button">
                View Projects
            </Link>
            <Link href="/auth" className="home-button">
                Account
            </Link>
        </div>
    </>
    );
}