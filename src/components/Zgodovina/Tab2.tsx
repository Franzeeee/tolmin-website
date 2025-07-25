import React from 'react'
import Image from 'next/image'

export default function Tab2() {
    return(<>
    <div className="w-full p-4 flex h-fit gap-8 flex-col justify-center items-center max-w-5xl">
        {/* Image: Image */}
        <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/t1.png'}
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
                Člansko moštvo NK Tolmin je do sezone 1973/74 igralo v 2. Zcnl, po izpadu pa v primorski nogometni ligi ter pozneje v ligah pod okriljem zdajšnje MNZ Nova Gorica.
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>                
                V sezoni 1975/76 so Tolminci osvojili prvo mesto v ligi sedanje MNZ in z Jadranom iz dekanov, prvakom koprske MNZ, odigral dve kvalifikacijski tekmi za vnovični vstop v 2. Zcnl. Na žalost neuspešno, saj so obe tekmi zmagali Dekančani.
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>                
                Sredi sedemdesetih let je NK Tolmin odigral nekaj prijateljskih tekem proti takrat uglednim jugoslovanskim klubom − z Rijeko, Osijekom in Olimpijo. Prav na tekmi proti Olimpiji se je od nogometa poslovil Danilo Kanalec − Čine. Med letoma 1971 in 1979 je klub odigral tudi več prijateljskih srečanj z italijanskimi klubi.
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>                
                Leto 1975 je bilo posebej uspešno za mladince NK Tolmin pod takratnim vodstvom trenerja Ivana Gruntarja − Mičota. Po šampionskem naslovu v Primorski mladinski nogometni ligi so mladinci nato zaigrali v 1. slovenski mladinski nogometni ligi.
            </p>

        </div>

        <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/t2.png'}
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
                Sledilo je leto znamenitih Portoroških sklepov, ki so zaznamovali naslednja leta nogometa pod Kozlovim robom. Reorganizacija lig je tudi v tolminskem klubu negativno vplivala na motiviranost in ambicije igralcev ter uprave. Iz tekme v tekmo je bilo za člansko moštvo na voljo vedno manj igralcev. Ti so vztrajali do 9. maja 1979 − do finalne pokalne tekme na območju novogoriške MNZ med Tolminom in Vozili. Tolminci so tekmo izgubili z 0:3. Trinajstega maja so tekmo zadnjega kroga medobčinske lige MNZ Goriška zaradi premajhnega števila igralcev predali.
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>                
                V naslednjih sezonah je Nogometni klub Tolmin v ligah pod okriljem zdajšnje MNZ Nova Gorica zastopalo zgolj pionirsko moštvo, aktivni pa so bili veterani. Večina članskih igralcev, ki ni izgubila volje do nogometa, je nato odigrala več mednarodnih tekem z ekipami iz Italije.
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>                
                Ne najbolj veseli časi tolminskega nogometa pa so vseeno doživeli poseben trenutek: leta 1973 je namreč Brajda gostila dotlej rekorden obisk, potem ko se je na tekmi Tolmin − Vozila zbralo 1500 gledalcev. Tolminci so slavili s 3:2.
            </p>

        </div>

        <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/t3.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 650px"
                priority
            />
        </div>

         <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Po prej omenjenih Portoroških sklepih so v Tolminu želeli obuditi člansko moštvo najprej leta 1981. Toda domačini so za ta korak potrebovali štajersko pomoč. Pobudo in obvezo za vnovično rojstvo članov je prevzel Dušan Bezjak, ki je na Tolminskem že prej pustil svoj pečat: ustanovil je Rokometni klub Tolmin, vodil malonogometne lige občine Tolmin, treniral rokometašice …
            </p>
        </div>

        <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/t4.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 650px"
                priority
            />
        </div>

        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Izziv je bil tudi, da je v takratnem pokalu Maršala Tita sodelovala ekipa Cezar iz Kobarida. V tem obdobju je sicer pod okriljem legendarnega Mirka Filija delovala pionirska ekipa, ki pa se je kmalu porazgubila po malonogometnih klubih. Padla je odločitev, da se spomladi leta 1982 začne zbirati nekdanje igralce za redno vadbo in za prijavo v pokal Maršala Tita.]
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Takrat je sicer klub vodil Joško Cimerman, vendar je v odločilnem letu prepustil aktivnosti Bezjaku − Zmaju. Sledilo je krajše obdobje prepričevanja igralcev, ki bi jih nogomet še zanimal, predvsem pa vrstnike zadnje najbolj uspešne ekipe mladincev iz leta 1974.
            </p>
        </div>

        <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/t5.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 650px"
                priority
            />
        </div>

        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Delo je obrodilo sadove, saj so se treningi članskega moštva začeli jeseni 1982 in priprava na pokalno tekmo. Žreb se je sicer poigral s Tolminci, saj sta se že v prvem krogu srečala sosedski ekipi NK Cezar in NK Tolmin. Tekmo v Kobaridu so nato zmagali domačini.
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Odločitev je padla, da se z delom nadaljuje tudi v prihodnjem letu. Klub se je prijavil v športno zvezo kot aktiven član, domača občina pa je obljubila finančno pomoč. Odtlej se je začela urejati Brajda. Igrišče, ki so ga prej kosili kmetje za seno za živino, so odgovorni začeli redno kositi, uredilo se je slačilnice, predvsem pa je organizacija in vodstvo kluba. Leta 1983 je na občnem zboru kluba predsedniško funkcijo prevzel Stane Kovačič, člansko moštvo pa se je prijavilo v goriško člansko ligo.
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Preglavic s člani vseeno ni bilo konec. Po porazu z 1:6 proti Jesenicam so se nekateri starejši igralci odpovedali treniranju in igranju. Kljub temu je Bezjak nase prevzel odločitev, da se za vsako ceno nastopi v ligi. NK Tolmin je v prvenstvu nastopil s pionirsko-mladinsko postavo, okrepljeno z nekaterimi starejšimi igralci. V sezoni je Tolmin na koncu prvenstva osvojil dragoceni dve točki, ki sta bili temelj za nadaljnji članski vzpon.
            </p>
        </div>

        <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/t6.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 650px"
                priority
            />
        </div>

        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                V sezoni 1984/85 je člane prevzel Boban Veličković, ki je poleg trenerskega znanja dodal še veliko organizacijskih in praktičnih lastnosti. Sezona je bila uspešnejša in kvalitetnejša saj je v osemčlanski goriški ligi NK Tolmin osvojil četrto mesto. Leta 1985 je predsedniško mesto zasedel Dušan Taljat, klub pa je sploh prvič izvedel skupne priprave, in sicer v bovški vojašnici. Naslednjo sezono je klub zasedel peto mesto med desetimi ekipami, ob koncu leta 1986 pa sodeloval tudi na nogometnem turnirju FK Mladost v Vojvodini.
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>   
                V naslednjem letu se je spremenil rang tekmovanja, Tolmin pa je napredoval v Primorsko člansko nogometno ligo. Med sezono je prišlo tudi do menjave na trenerskem stolčku, saj je Bobana Veličkovića zamenjal Toni Podrecca. Mladinska ekipa pod vodstvom trenerja Marjana Krajnika je takrat imela možnost napredovanja v Slovensko mladinsko ligo, vendar se je zaradi financ klub temu odpovedal. Tako je pet najperspektivnejših mladincev takrat prestopilo v Vodice iz  Šempasa.
            </p>

        </div>

         <div className="relative w-full h-[400px] max-h-[500px] xl:w-[650px] xl:h-[650px] xl:max-h-[1200px]">
            <Image 
                src={'/zgodovina/t7.png'}
                alt="Example"
                className="object-contain xl:object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 650px"
                priority
            />
        </div>

        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black max">
            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Po končani sezoni 1989/90 je Taljat zapustil predsedniško funkcijo, nadomestil pa ga je Dušan Bezjak. Spomladanski del tekmovanja v PNL se je končal neuspešno, zato je klub zaradi administrativnih okoliščin izpadel iz lige in se v naslednji sezoni vključil v MČNL Ajdovščina-Idrija. Takrat je klub v trajno last dobil od družbe Metalflex avtobus TAM za potrebe klubskih prevozov. Tolminci so še v isti sezoni osvojili omenjeno ligo in se spet uvrstili v višji rang tekmovanja. Občni zbor novembra leta 1991 je spet prinesel spremembo na predsedniškem mestu, Bezjaka pa je zamenjal Miloš Batistuta. Spremenilo se je tudi ime kluba iz NK Tolmin v NK Avtoprevoz Tolmin, trener članov je postal Krajnik Marjan, ki pa se je poslovil po spomladanskem delu. Klubu se je nato ponudila možnost napredovanja v 3. SNL Zahod, kar je sprejel kot izziv.
            </p>

            <p className='text-lg text-gray-800 mb-4 text-justify'>
                Sledile so težave s trenerji. Še v prvem krogu je ekipo vodil Ivan Faganeli, ki pa jo je takoj zapustil. Nasledil ga je Toni Podrecca s pomočnikom Zvonkom Peršičem, ki je postal glavni trener članov leta 1993. Klub je nato izpadel in zaigral v Enotni primorski nogometni ligi. Jeseni se je klub udeležil športnega srečanja na Nizozemskem. Naslednjega leta je predsednikovanje zaključil Batistuta, vajeti kluba pa je uspešno prevzela Petra Brelih. K sodelovanju je pritegnila PSC Tolmin, klub pa se je zato preimenoval v NK PSC Tolmin.
            </p>

        </div>

        <div className="flex items-start justify-center w-full p-4 py-0 flex-col poppins text-black border-t-2 border-gray-200 pt-10">
            <a
                href="https://www.nktolmin.si/wp-content/uploads/2014/08/Rezultati-NK-Tolmin-arhiv-1991-2014.pdf"
                target="_blank"
                className="m-auto px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
            >
                Rezultati NK Tolmin 1991-2014
            </a>
        </div>





    </div>

    </>)
}