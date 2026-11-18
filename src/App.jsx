import { CardModal, Collection } from "./components/Collection"
import { CartDrawer, Toast } from "./components/CartDrawer"
import { Countdown, HowItWorks, Offers, Rarity } from "./components/Drop"
import { Header, MobileBar } from "./components/Header"
import { Hero } from "./components/Hero"
import { Faq, FinalCta, Footer, Guarantee, Reviews, Shipping, Ticker, WhyUs } from "./components/Trust"
import { ShopProvider, useShop } from "./shop"

export default function App() {
  return (
    <ShopProvider>
      <Page />
    </ShopProvider>
  )
}

function Page() {
  const { locked } = useShop()
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-void">
        <div className="hud-grid absolute inset-0" />
        <img src="/backdrop/optimus.png" alt="" aria-hidden="true" className="optimus-backdrop" />
        <div className="page-scrim absolute inset-0" />
      </div>
      <a
        href="#utama"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[80] focus:bg-autobot focus:px-4 focus:py-2 focus:text-void"
      >
        Langkau ke kandungan
      </a>
      <div inert={locked || undefined}>
        <Header />
        <main>
          <Hero />
          <HowItWorks />
          <Countdown />
          <Offers />
          <Rarity />
          <Collection />
          <Guarantee />
          <WhyUs />
          <Ticker />
          <Reviews />
          <Shipping />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <MobileBar />
      </div>
      <CardModal />
      <CartDrawer />
      <Toast />
    </>
  )
}
