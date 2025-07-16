import React from 'react'
import Image from 'next/image'

export default function Tab1() {
    return(<>
    <div className="w-full p-4 flex h-fit gap-8 flex-col justify-center items-center max-w-5xl">
        {/* Image: Image */}
        <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/p1.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 650px"
                priority
            />
        </div>

        {/* Text: Content */}
        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Nogometna igra, ki se je v začetku tega stoletja začela širiti iz Anglije po evropski celini, je našla plodna tla in svoje zveste pristaše tudi pri nas. V Tolminu, majhnem kulturnem središču gornjega Posočja, se je v prvih povojnih letih zbirala mlada generacija na meščanski šoli in učiteljišču, kamor so prihajali učenci iz vse Primorske. Na čelu te mladine je bilo napredno učno osebje, ki je odigralo veliko vlogo pri kulturnem in športnem razvoju tega severnega dela Primorske. Tako sta bila ravno meščanska šola in učiteljišče iniciatorja in nosilca razvoja nogometa.
            </p>

            <h1 className="text-2xl font-bold mb-6 text-center mt-5 text-left">
                Leta 1921 je leto rojstvo nogometne igre v Tolminu.
            </h1>

            <p className='text-lg text-gray-800 mb-4 text-justify'>                
                Že pred tem so se pojavili na ulici otroci z gumijastimi žogami, vendar jim je žoga služila samo kot otroška zabavna atrakcija. Prvi pionir nogometne igre v Tolminu je bil profesor Matelič, doma iz Livka, ki je poučeval telovadbo v meščanski in učiteljski šoli. Pozimi je vadil učence v šolski telovadnici v bivšem gasilskem domu, v stavbi kjer je danes del osnovne šole, spomladi pa je vodil učence na strelišče »Krnice«, kjer so učenci na »Lukovem travniku« igrali po ustaljenih pravilih nogometne igre. Ko pa je trava zrasla, jim je lastnik prepovedal igranje in so si morali v sili poiskati neprimerne gmajne. Igrišče na Krnicah je bilo dolgo 60 do 70, vrata je označevala sproti položena opeka, širina igrišča pa ni bila pomembna. V šolskih urah je profesor Matelič poučeval teorijo igre, v prostih urah pa je vadil igralce in jim hkrati sodil.
            </p>

        </div>

        <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/p2.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 650px"
                priority
            />
        </div>

        {/* Text: Content */}
        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Ustvaril je ekipo meščanske šole, v kateri so bili prvi igralci učenci Batič, Vogrič, Šajn, Brenčič, Pahor, Medveš, Kravanja, Fili, Venturini, Ručna in drugi in ekipo učiteljišča z učenci Gruntarjem, Miklavičem, Kravanjem, Hrastom in s tremi brati Fabris in z drugimi.
                Igranje se je najprej razvilo med meščansko šolo in učiteljiščem, pozneje tudi z vojsko, nastanjeno v Tolminu, ki je postopoma dovolila igranje nogometa v regularnem igrišču v tolminskih kasarnah.
            </p>

            <h1 className="text-2xl font-bold mb-6 text-center mt-5 text-left">
                Leta 1921 je leto rojstvo nogometne igre v Tolminu.
            </h1>

            <p className='text-lg text-gray-800 mb-4 text-justify'>                
                Iz leta v leto si je nogomet pridobil vedno večji razmah in da bi igra postala še zanimivejša so začeli iskati stike s sosednjimi nogometnimi klubi in jih vabiti na gostovanje. Prvo medkrajevno nogometno srečanje je bilo spomladi leta 1923 na igrišču tolminskih kasarn med tolminskim učiteljiščem in realko iz Idrije. Drugo medkrajevno srečanje je bilo z moštvom Kobarida leta 1926 v Kobaridu. Bila je to druga medkrajevna tekma in prvi poraz Tolmina. To tekmo je sodil Ljubko Slamič. Spričo naglega razvoja in nogometnega navdušenja je v letu 1927 tolminska občina zgradila novo športno igrišče Na logu. Od tega časa dalje so se redno in letno vršila tekmovanja v obliki turnirja po sistemu izpadanja. V tem času so igrali Vogrič, Kacafura, Brenčič, Rutar, Fabrisi, Zorz, Urbančič, Obleščak, Gaberšček in drugi. Tolminsko moštvo je igralo v Kobaridu, Bovcu, Anhovem, Solkanu, Čedadu, Ločniku, Krminu in v Gradiški. Zanimivo je, da je na teh turnirjih moštvo Tolmina doseglo drugo mesto. Medtem je bila ukinjena meščanska šola in se je razmeroma hitro razvijal dijaški dom. S tem se je počasi medsebojno tekmovanje preneslo na gojence v dijaškem domu in na mladino izven doma. Kadar je bilo treba igrati proti vojski ali izven Tolmina so moštvo sestavili iz najboljših iz obeh ekip. V letu 1927 je profesor Matelič zapustil Tolmin in vodstveni položaj v organizaciji nogometa so prevzeli bratje Fabris, ki so uspešno nadaljevali delo profesorja Mateliča in izdatno prispevali pri nabavi potrebnih rekvizitov.
            </p>

        </div>

        <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/p3.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 650px"
                priority
            />
        </div>

         <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Okoli leta 1930 je narasla Soča v celoti uničila igrišče Na logu, zato se je igranje ponovno preneslo v kasarne, deloma Na lopo (Kozarišče) v Zalogu in na igrišče pri dijaškem domu, ki pa ni imelo predpisanih mer. Šele leta 1933 je tolminska občina odstopila v športne namene občinsko zemljišče dotedanje drevesnice v Brajdi. Dijaki in ostala mladina so z velikim naporom in s prostovoljnim delom uredili novo igrišče z minimalnimi merami, ki so potrebne za igro. Od tega časa dalje je ime Brajda pojem za športno udejstvovanje Tolmina.
            </p>
        </div>

        <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/p4.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 650px"
                priority
            />
        </div>

        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Kakor hitro je po osvoboditvi leta 1945 utihnilo orožje, je nogomet ponovno zaživel. Še predno so se vsi domači fantje vrnili iz raznih vojaških edinic in internacije,je bila že odigrana prva tekma v Brajdi dne 2. septembra 1945 proti edinici tolminske garnizije. Ni bilo oblek, niti čevljev, igrali so v copatah. Na brezrokavne majice so prišili rdečo zvezdo. Če je bilo le mogoče, so vsako nedeljsko popoldne igrali nogomet na Brajdi.
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Spomladi leta 1946 je bilo ustanovljeno Športno društvo Tolmin, v katerem je imelo glavno vlogo nogometno moštvo. Za predsednika je bil izvoljen tov. Bojan Savnik, ki je uspešno vodil društvo; gmotno ga je podpiral ter položil trdne temelje za nadaljnji razvoj nogometa na Tolminskem. Še istega leta je bilo osnovano okrožno nogometno prvenstvo, kar je dalo upanje, da se bo nogomet organizacijsko še bolje razvijal in da bodo dane vse možnosti za vključitev moštva v širše tekmovanje izven ožjih krajevnih meja.
            </p>
        </div>

        <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/p5.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 650px"
                priority
            />
        </div>

        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                V jeseni leta 1946 je bilo igrišče v Brajdi odvzeto društvu, da bi tam uredili zelenjavni vrt, toda spomladi leta 1947 je že bilo vrnjeno svojemu namenu, ker tam zelenjava ni uspevala. Mladina in vojska sta s prostovoljnim delom igrišče znova razširili, znižali in podaljšali. Društvo se je kmalu zatem preimenovalo v Fizkulturno društvo Tolmin in nogometno moštvo je spet tudi v tem okviru redno sodelovalo na tekmovanjih po vsej Primorski. Najzanimivejša so bila srečanja z društvi iz Solkana, Mirna, Idrije, Nove Gorice, Ajdovščine, Vipave, Postojne, Sežane in Anhovega. Istočasno je društvo odigralo mnogo prijateljskih tekem in sodelovalo na raznih turnirjih izven Primorske.
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>
                V letu 1952 je bilo ustanovljeno Telovadno društvo Partizan, h kateremu se je pripojilo tudi nogometno moštvo potem, ko je Fizkulturno društvo razpadlo. Pod okriljem TVD Partizana je nogometno moštvo doseglo najvidnejše uspehe. V letu 1960 je osvojilo prvič naslov prvaka Primorske v enotni ligi vsega Slovenskega primorja. Naslov prvaka goriške podzveze je osvojilo v letu 1961-62 in ponovno leta 1965-66, ko je vstopilo v višjo zahodno consko ligo SRS.
            </p>
        </div>

        <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/p6.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 650px"
                priority
            />
        </div>

        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                V letu 1962 je Občinska zveza za telesno vzgojo v Tolminu finančno podprla izgradnjo novega stadiona, ki je bil svečano odprt. 15. oktobra 1967 s prvenstveno nogometno tekmo z NK Kamnik. Od leta 1966 dalje je moštvo uspešno igralo v zahodni conski ligi SRS in je v letu 1969-1970 doseglo peto mesto na končni lestvici te lige. Nogometno moštvo je odigralo 34 mednarodnih tekem z italijanskimi sosednjimi klubi. Prva mednarodna tekma je bila odigrana v Trebčah pri Trstu leta 1954 z mešanim moštvom iz Bazovice in Trebč. Prvi mednarodni gost v Tolminu je bila A.C.Cividalese 1. maja 1964. Od tega leta dalje so se vrstile tekme doma in v tujini. Igrala so moštva iz Gradiške, Villa Santine, Gemone, Pordenone, Vidma in tudi moštva zamejskih Slovencev iz Standreža, Šempetra ob Nadiži in Svetega Lenarta v Beneški Sloveniji.
            </p>

        </div>

         <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/p7.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 650px"
                priority
            />
        </div>

        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                V letu 1962 je Občinska zveza za telesno vzgojo v Tolminu finančno podprla izgradnjo novega stadiona, ki je bil svečano odprt. 15. oktobra 1967 s prvenstveno nogometno tekmo z NK Kamnik. Od leta 1966 dalje je moštvo uspešno igralo v zahodni conski ligi SRS in je v letu 1969-1970 doseglo peto mesto na končni lestvici te lige. Nogometno moštvo je odigralo 34 mednarodnih tekem z italijanskimi sosednjimi klubi. Prva mednarodna tekma je bila odigrana v Trebčah pri Trstu leta 1954 z mešanim moštvom iz Bazovice in Trebč. Prvi mednarodni gost v Tolminu je bila A.C.Cividalese 1. maja 1964. Od tega leta dalje so se vrstile tekme doma in v tujini. Igrala so moštva iz Gradiške, Villa Santine, Gemone, Pordenone, Vidma in tudi moštva zamejskih Slovencev iz Standreža, Šempetra ob Nadiži in Svetega Lenarta v Beneški Sloveniji.
            </p>

        </div>





    </div>

    </>)
}