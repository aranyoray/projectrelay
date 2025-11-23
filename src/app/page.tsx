'use client';
import GradientBlinds from "@/components/home/gradient-blinds";
import HomeTitle from "@/components/home/home-title";
import BubbleMenu from "@/components/universal/bubble-menu";
import CircularText from "@/components/universal/circular-text";

const items = [
    {
        label: 'Home',
        href: '/',
        ariaLabel: 'Home',
        rotation: -8,
        hoverStyles: { bgColor: '#006D77', textColor: '#ffffff' }
    },
    {
        label: 'Projects',
        href: '/projects',
        ariaLabel: 'Projects',
        rotation: 8,
        hoverStyles: { bgColor: '#006D77', textColor: '#ffffff' }
    },
    {
        label: 'About',
        href: '/about',
        ariaLabel: 'About',
        rotation: 8,
        hoverStyles: { bgColor: '#006D77', textColor: '#ffffff' }
    },
    {
        label: 'Account',
        href: '/auth',
        ariaLabel: 'Account',
        rotation: -8,
        hoverStyles: { bgColor: '#006D77', textColor: '#ffffff' }
    }
];

export default function Home() {
    return(
        <>
            <div id="homepage">
                <BubbleMenu
                    logo={<span style={{ fontWeight: 700 }}><CircularText
                        text="PROJECT•RELAY•"
                        onHover="speedUp"
                        spinDuration={20}
                        className="logo-circle"
                    /></span>}
                    items={items}
                    menuAriaLabel="Toggle navigation"
                    menuBg="#ffffff"
                    menuContentColor="#111111"
                    useFixedPosition={false}
                    animationEase="back.out(1.5)"
                    animationDuration={0.5}
                    staggerDelay={0.12}
                />
                <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
                    <GradientBlinds
                        gradientColors={['#006D77', '#F9F9F9']}
                        angle={20}
                        noise={0.3}
                        blindCount={24}
                        blindMinWidth={50}
                        spotlightRadius={0.5}
                        spotlightSoftness={1}
                        spotlightOpacity={1}
                        mouseDampening={0.15}
                        distortAmount={0}
                        shineDirection="left"
                        mixBlendMode="lighten"
                    />
                </div>
                <HomeTitle />
            </div>
        </>
    );
}