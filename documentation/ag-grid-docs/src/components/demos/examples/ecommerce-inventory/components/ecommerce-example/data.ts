export function getData() {
    const data = [
        {
            product: 'Rumours',
            artist: 'Fleetwood Mac',
            category: 'Soft Rock',
            year: '1977',
            status: 'Active',
            available: 12,
            incoming: 45,
            image: 'rumours',
            price: 40,
            sold: 15,
            priceIncrease: 5, // in percentage
            variants: 3,
            variantDetails: [
                {
                    title: 'Rumours',
                    available: 4,
                    format: 'LP, Album, Picture Disc, Reissue',
                    label: 'Warner Records',
                    cat: 'RPD1 3010',
                    country: 'Worldwide',
                    year: '2024',
                },
                {
                    title: 'Rumours',
                    available: 6,
                    format: 'Blu-Ray, Album, Reissue, Dolby Atoms',
                    label: 'Warner Records',
                    cat: 'BA2 3010',
                    country: 'Worldwide',
                    year: '2024',
                },
                {
                    title: 'Rumours',
                    available: 2,
                    format: 'CD, Album, Reissue, Remastered',
                    label: 'Warner Records',
                    cat: 'R2 599763',
                    country: 'Worldwide',
                    year: '2024',
                },
            ],
        },
        {
            product: 'Future Nostalgia',
            artist: 'Dua Lipa',
            category: 'Pop',
            year: '2020',
            status: 'Out of Stock',
            available: 0,
            incoming: 0,
            image: 'futurenostalgia',
            price: 29,
            sold: 5,
            priceIncrease: 10,
            variants: 1,
            variantDetails: [
                {
                    title: 'Future Nostalgia',
                    available: 0,
                    format: 'LP, Limited Edition, Magenta',
                    label: 'Warner Records',
                    cat: '5054197954467',
                    country: 'Worldwide',
                    year: '2024',
                },
            ],
        },
        {
            product: 'Actually',
            artist: 'Pet Shop Boys',
            category: 'Synth-pop',
            year: '1987',
            status: 'Active',
            available: 25,
            incoming: 0,
            image: 'actually',
            price: 25,
            sold: 7,
            priceIncrease: 10,
            variants: 2,
            variantDetails: [
                {
                    title: 'Actually',
                    available: 13,
                    format: 'LP, Album, Reissue, 180 Gram',
                    label: 'Parlophone',
                    cat: '0190295832612',
                    country: 'USA & Europe',
                    year: '2018',
                },
                {
                    title: 'Actually / Further Listening 1987-1988',
                    available: 12,
                    format: 'CD, Album, Compilation; All Media, Reissue, Remastered',
                    label: 'Warner Records',
                    cat: '01902958262222',
                    country: 'Europe',
                    year: '2018',
                },
            ],
        },
        {
            product: 'Back to Black',
            artist: 'Amy Winehouse',
            category: 'Rhythm & Blues',
            year: '2006',
            status: 'Paused',
            available: 3,
            incoming: 19,
            image: 'backtoblack',
            price: 33,
            sold: 39,
            priceIncrease: 5,
            variants: 4,
            variantDetails: [
                {
                    title: 'Back to Black',
                    available: 1,
                    format: 'CD, Album, Enhanced',
                    label: 'Island Records Group',
                    cat: '171 304-1',
                    country: 'UK',
                    year: '2006',
                },
                {
                    title: 'Back to Black The Album Remixes',
                    available: 0,
                    format: '2×CD, Promo',
                    label: 'Island Records Ltd',
                    cat: 'AMYCDPRO15',
                    country: 'Europe',
                    year: '2007',
                },
                {
                    title: 'Back to Black',
                    available: 0,
                    format: 'LP, Album, Picture Disc, Reissue',
                    label: 'Island Records',
                    cat: '3579647',
                    country: 'Europe',
                    year: '2023',
                },
                {
                    title: 'Back to Black',
                    available: 4,
                    format: 'LP, Album, Limited Edition, Reissue, Pink',
                    label: 'Republic Records',
                    cat: 'B0030246-01 ST01',
                    country: 'US',
                    year: '2024',
                },
            ],
        },
        {
            product: 'In A Dream',
            artist: 'Troye Sivan',
            category: 'Pop',
            year: '2020',
            status: 'Out of Stock',
            available: 0,
            incoming: 0,
            image: 'inadream',
            price: 35,
            sold: 10,
            priceIncrease: 30,
            variants: 2,
            variantDetails: [
                {
                    title: 'In A Dream',
                    available: 0,
                    format: 'CD, EP',
                    label: 'Capitol Records',
                    cat: 'DR3AM01',
                    country: 'US',
                    year: '2020',
                },
                {
                    title: 'In A Dream',
                    available: 0,
                    format: 'LP, EP, Blue Mist',
                    label: 'EMI',
                    cat: 'DR3AM02',
                    country: 'Europe',
                    year: '2020',
                },
            ],
        },
        {
            product: '21',
            artist: 'Adele',
            category: 'Pop',
            year: '2011',
            status: 'Active',
            available: 5,
            incoming: 10,
            image: '21',
            price: 28,
            sold: 4,
            priceIncrease: 12,
            variants: 2,
            variantDetails: [
                {
                    title: '21',
                    available: 1,
                    format: 'LP, Album, Stereo',
                    label: 'XL Recordings',
                    cat: 'XLLP 520',
                    country: 'Europe',
                    year: '2011',
                },
                {
                    title: '21',
                    available: 4,
                    format: 'CD, Album, Limited Edition',
                    label: 'XL Recordings',
                    cat: 'XLLP 520 E',
                    country: 'Europe',
                    year: '2011',
                },
            ],
        },
        {
            product: 'Anti',
            artist: 'Rihanna',
            category: 'Rhythm & Blues',
            year: '2016',
            status: 'Active',
            available: 10,
            incoming: 23,
            image: 'anti',
            price: 29,
            sold: 19,
            priceIncrease: 20,
            variants: 1,
            variantDetails: [
                {
                    title: 'Anti',
                    available: 10,
                    format: '2×LP, Album, Reissue, Red Translucent',
                    label: 'Roc Nation',
                    cat: 'B0037402-01',
                    country: 'US',
                    year: '2023',
                },
            ],
        },
        {
            product: 'Hunting High and Low',
            artist: 'a-ha',
            category: 'Synth-pop',
            year: '1985',
            status: 'Out of Stock',
            available: 0,
            incoming: 5,
            image: 'huntinghighandlow',
            price: 20,
            sold: 25,
            priceIncrease: 0,
            variants: 1,
            variantDetails: [
                {
                    title: 'Hunting High and Low',
                    available: 0,
                    format: 'LP, Album, Limited Edition, Reissue, Orange',
                    label: 'Warner Records',
                    cat: '081227827311',
                    country: 'UK',
                    year: '2023',
                },
            ],
        },
        {
            product: 'Blue',
            artist: 'Joni Mitchell',
            category: 'Rock',
            year: '1971',
            status: 'Out of Stock',
            available: 0,
            incoming: 0,
            image: 'blue',
            price: 31,
            sold: 20,
            priceIncrease: 15,
            variants: 1,
            variantDetails: [
                {
                    title: 'Blue',
                    available: 0,
                    format: 'LP, Album, Reissue, Remastered, Stereo, 180 Gram, Gatefold',
                    label: 'Reprise Records',
                    cat: '603497844173',
                    country: 'USA & Europe',
                    year: '2022',
                },
            ],
        },
        {
            product: 'The Marshall Mathers',
            artist: 'Eminem',
            category: 'Hip Hop',
            year: '2000',
            status: 'Out of Stock',
            available: 0,
            incoming: 5,
            image: 'marshall',
            price: 25,
            sold: 7,
            priceIncrease: 10,
            variants: 1,
            variantDetails: [
                {
                    title: 'The Marshall Mathers LP',
                    available: 0,
                    format: '2×LP, Album, Stereo',
                    label: 'Interscope',
                    cat: '069490629-1',
                    country: 'USA',
                    year: '2022',
                },
            ],
        },
        {
            product: 'Discovery',
            artist: 'Daft Punk',
            category: 'Electronic',
            year: '2001',
            status: 'Paused',
            available: 7,
            incoming: 0,
            image: 'discovery',
            price: 20,
            sold: 2,
            priceIncrease: 5,
            variants: 3,
            variantDetails: [
                {
                    title: 'Discovery',
                    available: 7,
                    format: '2×LP, Album, Reissue, Gatefold',
                    label: 'ADA',
                    cat: '0190296617164',
                    country: 'Europe',
                    year: '2023',
                },
                {
                    title: 'Discovery',
                    available: 0,
                    format: '2×LP, Album, Reissue, Gatefold',
                    label: 'ADA',
                    cat: '0190296617164',
                    country: 'USA & Europe',
                    year: '2021',
                },
                {
                    title: 'Discovery',
                    available: 0,
                    format: '2×LP, Album, Reissue',
                    label: 'Parlophone',
                    cat: '7243 8496061 2',
                    country: 'Europe',
                    year: '2018',
                },
            ],
        },
        {
            product: 'The Dark Side of the Moon',
            artist: 'Pink Floyd',
            category: 'Rock',
            year: '1973',
            status: 'Paused',
            available: 0,
            incoming: 10,
            image: 'darksideofthemoon',
            price: 36,
            sold: 21,
            priceIncrease: 10,
            variants: 2,
            variantDetails: [
                {
                    title: 'The Dark Side of the Moon (Master Tape Copy)',
                    available: 0,
                    format: 'CD, Album, Numbered, Stereo',
                    label: 'Sigma',
                    cat: 'Sigma 309',
                    country: 'Japan',
                    year: '2023',
                },
                {
                    title: 'The Dark Side of the Moon',
                    available: 0,
                    format: '2×LP, Album, Reissue, Remastered, 180 Gram',
                    label: 'Pink Floyd Records',
                    cat: 'PFR50UVLP',
                    country: 'Europe',
                    year: '2024',
                },
            ],
        },
        {
            product: 'Nevermind',
            artist: 'Nirvana',
            category: 'Rock',
            year: '1991',
            status: 'Active',
            available: 21,
            incoming: 0,
            image: 'nevermind',
            price: 28,
            sold: 13,
            priceIncrease: 0,
            variants: 2,
            variantDetails: [
                {
                    title: 'Nevermind',
                    available: 15,
                    format: 'LP, Album, Limited Edition, Reissue, Repress, Silver',
                    label: 'DGC',
                    cat: 'DGC-24425',
                    country: 'USA',
                    year: '2023',
                },
                {
                    title: 'Nevermind',
                    available: 6,
                    format: 'LP, Album, Reissue',
                    label: 'Sub Pop',
                    cat: '0720642442517',
                    country: 'Europe',
                    year: '2023',
                },
            ],
        },
        {
            product: 'Lemonade',
            artist: 'Beyoncé',
            category: 'Rhythm & Blue',
            year: '2016',
            status: 'Active',
            available: 3,
            incoming: 0,
            image: 'lemonade',
            price: 40,
            sold: 6,
            priceIncrease: 0,
            variants: 3,
            variantDetails: [
                {
                    title: 'Lemonade',
                    available: 1,
                    format: '2×LP, Album, Yellow 180 Gram',
                    label: 'Parkwood Entertainment',
                    cat: '88985446751',
                    country: 'Europe',
                    year: '2023',
                },
                {
                    title: 'Lemonade',
                    available: 1,
                    format: '2×LP, Album, Yellow, Gatefold',
                    label: 'Parkwood Entertainment',
                    cat: '88985446751',
                    country: 'USA',
                    year: '2017',
                },
                {
                    title: 'Lemonade',
                    available: 1,
                    format: 'CD, Album, DVD',
                    label: 'Parkwood Entertainment',
                    cat: '88985336822',
                    country: 'Europe',
                    year: '2016',
                },
            ],
        },
        {
            product: 'Thriller',
            artist: 'Michael Jackson',
            category: 'Pop',
            year: '1982',
            status: 'Active',
            available: 12,
            incoming: 4,
            image: 'thriller',
            price: 28,
            sold: 4,
            priceIncrease: 4,
            variants: 1,
            variantDetails: [
                {
                    title: 'Thriller - 40th Anniversary',
                    available: 12,
                    format: '2×LP',
                    label: 'Epic',
                    cat: 'EPCMJTH40',
                    country: 'USA & Europe',
                    year: '2024',
                },
            ],
        },
        {
            product: 'Lust For Life',
            artist: 'Lana Del Rey',
            category: 'Alt-pop',
            year: '2017',
            status: 'Paused',
            available: 2,
            incoming: 18,
            image: 'lustforlife',
            price: 38,
            sold: 43,
            priceIncrease: 12,
            variants: 2,
            variantDetails: [
                {
                    title: 'Lust For Life',
                    available: 2,
                    format: '2×LP, Album, Limited Edition, Reissue, Repress, Clear',
                    label: 'Interscope Records',
                    cat: '5765501',
                    country: 'Worldwide',
                    year: '2023',
                },
                {
                    title: 'Lust For Life',
                    available: 0,
                    format: '2×LP, Album, Reissue, Stereo',
                    label: 'Polydor',
                    cat: '5758996',
                    country: 'USA & Europe',
                    year: '2017',
                },
            ],
        },
        {
            product: 'Clarity',
            artist: 'Zedd',
            category: 'Electronic',
            year: '2012',
            status: 'Active',
            available: 9,
            incoming: 0,
            image: 'clarity',
            price: 25,
            sold: 10,
            priceIncrease: 5,
            variants: 1,
            variantDetails: [
                {
                    title: 'Clarity',
                    available: 9,
                    format: '2×LP, Album, Deluxe Edition, Reissue',
                    label: 'Interscope Records',
                    cat: 'B0018814-01',
                    country: 'USA',
                    year: '2023',
                },
            ],
        },
        {
            product: 'Hit Me Hard and Soft',
            artist: 'Billie Eilish',
            category: 'Alt-pop',
            year: '2024',
            status: 'Active',
            available: 33,
            incoming: 0,
            image: 'hitmehardandsoft',
            price: 31,
            sold: 23,
            priceIncrease: 0,
            variants: 5,
            variantDetails: [
                {
                    title: 'Hit Me Hard and Soft',
                    available: 5,
                    format: 'LP, Album',
                    label: 'Darkroom',
                    cat: '602465223651',
                    country: 'Worldwide',
                    year: '2024',
                },
                {
                    title: 'Hit Me Hard and Soft',
                    available: 2,
                    format: 'CD, Album, Poster Insert',
                    label: 'Darkroom',
                    cat: '602465568943',
                    country: 'Worldwide',
                    year: '2024',
                },
                {
                    title: 'Hit Me Hard and Soft',
                    available: 1,
                    format: 'CD, Album, Limited Edition, Signed',
                    label: 'Darkroom',
                    cat: '602465223671',
                    country: 'Worldwide',
                    year: '2024',
                },
                {
                    title: 'Hit Me Hard and Soft',
                    available: 10,
                    format: 'LP, Album, White',
                    label: 'Darkroom',
                    cat: '602465270532',
                    country: 'Worldwide',
                    year: '2024',
                },
                {
                    title: 'Hit Me Hard and Soft',
                    available: 7,
                    format: 'LP, Album, Blue',
                    label: 'Darkroom',
                    cat: '602465223612',
                    country: 'Worldwide',
                    year: '2024',
                },
            ],
        },
        {
            product: 'What Happened To The Heart?',
            artist: 'AURORA',
            category: 'Alt-pop',
            year: '2024',
            status: 'Paused',
            available: 5,
            incoming: 0,
            image: 'whathappenedtotheheart',
            price: 25,
            sold: 10,
            priceIncrease: 0,
            variants: 2,
            variantDetails: [
                {
                    title: 'What Happened To The Heart?',
                    available: 5,
                    format: '2×LP, Album, Stereo',
                    label: 'Decca',
                    cat: '651 5199',
                    country: 'Worldwide',
                    year: '2024',
                },
                {
                    title: 'What Happened To The Heart?',
                    available: 0,
                    format: '2×LP, Album, Limited Edition, Stereo, Red w/ Blue Splatter',
                    label: 'Decca',
                    cat: '651 5203',
                    country: 'Worldwide',
                    year: '2024',
                },
            ],
        },
        {
            product: 'Group Theapy',
            artist: 'Above & Beyond',
            category: 'Trance',
            year: '2021',
            status: 'Active',
            available: 2,
            incoming: 2,
            image: 'grouptherapy',
            price: 20,
            sold: 1,
            priceIncrease: 0,
            variants: 1,
            variantDetails: [
                {
                    product: 'Group Therapy',
                    available: 2,
                    format: '2×LP, Album, Reissue, Gatefold',
                    label: 'Anjunabeats',
                    cat: 'ANJLP024',
                    country: 'Europe',
                    year: '2021',
                },
            ],
        },
    ];
    return data;
}
