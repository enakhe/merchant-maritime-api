import { ObjectId } from "mongoose"

export interface Post {
    title: string,
    slug: string,
    content: string,
    excerpt: string,
    image: string,
    author: ObjectId,
    category: ObjectId,
    tags: ObjectId[],
    publishedAt: NativeDate,
    updatedAt: NativeDate,
    status: string,
    isFeatured: boolean
    metaDescription: string,
    metaKeywords: string[],
    allowComments: boolean,
    views: number
}

export interface UserType {
    publicKey: string,
    username?: string | null,
    createdAt: NativeDate,
    updatedAt: NativeDate,
}

export const CATEGORIES = [
    { name: 'Entrepreneurship', description: 'Explore the Entrepreneurship category. Learn about startups, grants, and business strategies.' },
    { name: 'Education', description: 'Discover the Education category. Find resources on learning, teaching, and academic news.' },
    { name: 'Web3', description: 'Dive into the Web3 category. Learn about the decentralized web and its innovations.' },
    { name: 'NFTs', description: 'Discover the world of NFTs in this category. Explore unique digital assets and their impact.' },
    { name: 'DeFi', description: 'Understand the DeFi category. Learn about decentralized finance and its transformative potential.' },
    { name: 'Bitcoin', description: 'Stay informed with the Bitcoin category. Get the latest news and insights on the leading cryptocurrency.' },
    { name: 'Altcoins', description: 'Explore the Altcoins category. Discover various alternative cryptocurrencies and their developments.' },
    { name: 'Global', description: 'Stay updated with Global News. Get the latest international news and events.' },
    { name: 'Entertainment', description: 'Enjoy the Entertainment category. Find news and updates on movies, TV shows, and more.' },
    { name: 'Gaming', description: 'Dive into the Gaming category. Get the latest news and reviews on video games and esports.' },
    { name: 'Music', description: 'Explore the Music category. Discover new music, artist updates, and industry news.' },
    { name: 'Health', description: 'Stay informed with the Health category. Get the latest news and tips on health and wellness.' },
    { name: 'Science', description: 'Explore the Science category. Discover the latest research and scientific breakthroughs.' },
    { name: 'Technology', description: 'Stay updated with the Technology category. Get the latest news on tech innovations and gadgets.' },
    { name: 'Finance', description: 'Understand the Finance category. Learn about personal finance, investing, and market trends.' },
    { name: 'Travel', description: 'Discover the Travel category. Find tips and guides for your next adventure.' },
    { name: 'Lifestyle', description: 'Explore the Lifestyle category. Get tips on fashion, beauty, and everyday living.' },
    { name: 'Food', description: 'Enjoy the Food category. Discover recipes, restaurant reviews, and culinary tips.' },
    { name: 'Sports', description: 'Stay updated with the Sports category. Get the latest news and updates on various sports.' },
    { name: 'Environment', description: 'Understand the Environment category. Learn about sustainability and environmental issues.' },
    { name: 'Politics', description: 'Stay informed with the Politics category. Get the latest news and analysis on political events.' },
];

export const TAGS = [
    {
        category: 'Entrepreneurship',
        tags: [
            { name: 'Startup', description: 'News and tips for startups.' },
            { name: 'Grant', description: 'Information on grants and funding opportunities.' },
            { name: 'Business Strategy', description: 'Strategies for business growth and success.' },
            { name: 'Innovation', description: 'Innovative ideas and trends in entrepreneurship.' },
            { name: 'Leadership', description: 'Leadership tips and advice for entrepreneurs.' },
            { name: 'Marketing', description: 'Marketing strategies for businesses.' }
        ]
    },
    {
        category: 'Education',
        tags: [
            { name: 'Learning', description: 'Resources and tips for effective learning.' },
            { name: 'Teaching', description: 'Advice and strategies for teachers.' },
            { name: 'Academic News', description: 'Latest news in the academic world.' },
            { name: 'Online Courses', description: 'Information on online courses and e-learning.' },
            { name: 'Scholarships', description: 'Scholarship opportunities and tips.' },
            { name: 'Research', description: 'Updates on educational research and studies.' }
        ]
    },
    {
        category: 'Web3',
        tags: [
            { name: 'Blockchain', description: 'Blockchain technology in the Web3 category.' },
            { name: 'Decentralization', description: 'Decentralization topics in the Web3 category.' },
            { name: 'Smart Contracts', description: 'Smart contracts in the Web3 category.' },
            { name: 'DApps', description: 'Decentralized applications in the Web3 category.' },
            { name: 'Crypto', description: 'Cryptocurrency topics in the Web3 category.' },
            { name: 'Solana', description: 'Solana in the Web3 category.' }
        ]
    },
    {
        category: 'NFTs',
        tags: [
            { name: 'Art', description: 'NFT art in the NFTs category.' },
            { name: 'Collectibles', description: 'Collectible NFTs in the NFTs category.' },
            { name: 'Marketplace', description: 'NFT marketplaces in the NFTs category.' },
            { name: 'Gaming', description: 'NFTs in gaming in the NFTs category.' },
            { name: 'Music', description: 'Music NFTs in the NFTs category.' },
            { name: 'Investment', description: 'Investing in NFTs in the NFTs category.' }
        ]
    },
    {
        category: 'DeFi',
        tags: [
            { name: 'Lending', description: 'Lending platforms in the DeFi category.' },
            { name: 'Yield Farming', description: 'Yield farming in the DeFi category.' },
            { name: 'Staking', description: 'Staking in the DeFi category.' },
            { name: 'Liquidity Pools', description: 'Liquidity pools in the DeFi category.' },
            { name: 'Protocols', description: 'DeFi protocols in the DeFi category.' },
            { name: 'Governance', description: 'Governance in the DeFi category.' }
        ]
    },
    {
        category: 'Bitcoin',
        tags: [
            { name: 'BTC News', description: 'Latest news on Bitcoin.' },
            { name: 'Price Analysis', description: 'Price analysis of Bitcoin.' },
            { name: 'Mining', description: 'Bitcoin mining updates.' },
            { name: 'Adoption', description: 'Adoption of Bitcoin.' },
            { name: 'Regulation', description: 'Regulatory news on Bitcoin.' },
            { name: 'Market Trends', description: 'Market trends related to Bitcoin.' }
        ]
    },
    {
        category: 'Altcoins',
        tags: [
            { name: 'Ethereum', description: 'News and updates on Ethereum.' },
            { name: 'Litecoin', description: 'News and updates on Litecoin.' },
            { name: 'Ripple', description: 'News and updates on Ripple.' },
            { name: 'Cardano', description: 'News and updates on Cardano.' },
            { name: 'Polkadot', description: 'News and updates on Polkadot.' },
            { name: 'Chainlink', description: 'News and updates on Chainlink.' }
        ]
    },
    {
        category: 'Global',
        tags: [
            { name: 'World Economy', description: 'Economic news from around the world.' },
            { name: 'Health', description: 'Health news from around the world.' },
            { name: 'Environment', description: 'Environmental news from around the world.' },
            { name: 'Technology', description: 'Technology news from around the world.' },
            { name: 'Culture', description: 'Cultural news from around the world.' }
        ]
    },
    {
        category: 'Entertainment',
        tags: [
            { name: 'Movies', description: 'Latest news on movies.' },
            { name: 'TV Shows', description: 'Latest news on TV shows.' },
            { name: 'Celebrities', description: 'Celebrity news and gossip.' },
            { name: 'Awards', description: 'News on entertainment awards.' },
            { name: 'Reviews', description: 'Reviews of movies and TV shows.' },
            { name: 'Trailers', description: 'Latest trailers of upcoming movies and TV shows.' }
        ]
    },
    {
        category: 'Gaming',
        tags: [
            { name: 'Esports', description: 'News on esports and tournaments.' },
            { name: 'PC Gaming', description: 'News on PC gaming.' },
            { name: 'Console Gaming', description: 'News on console gaming.' },
            { name: 'Mobile Gaming', description: 'News on mobile gaming.' },
            { name: 'Game Reviews', description: 'Reviews of the latest games.' },
            { name: 'Game Releases', description: 'News on upcoming game releases.' }
        ]
    },
    {
        category: 'Music',
        tags: [
            { name: 'New Releases', description: 'Latest music releases.' },
            { name: 'Concerts', description: 'News on upcoming concerts.' },
            { name: 'Artists', description: 'News on music artists.' },
            { name: 'Albums', description: 'Latest album releases.' },
            { name: 'Genres', description: 'News on different music genres.' },
            { name: 'Music Videos', description: 'Latest music videos.' }
        ]
    },
    {
        category: 'Health',
        tags: [
            { name: 'Wellness', description: 'Tips and news on wellness.' },
            { name: 'Nutrition', description: 'Information on nutrition and healthy eating.' },
            { name: 'Fitness', description: 'Fitness tips and news.' },
            { name: 'Mental Health', description: 'News and tips on mental health.' },
            { name: 'Medical Research', description: 'Updates on medical research.' },
            { name: 'Public Health', description: 'News on public health issues.' }
        ]
    },
    {
        category: 'Science',
        tags: [
            { name: 'Space', description: 'News and updates on space exploration.' },
            { name: 'Physics', description: 'Discoveries and news in physics.' },
            { name: 'Biology', description: 'Updates and news in biology.' },
            { name: 'Chemistry', description: 'Discoveries and news in chemistry.' },
            { name: 'Earth Science', description: 'News on earth sciences.' },
            { name: 'Bio Tech', description: 'Latest scientific research and studies.' }
        ]
    },
    {
        category: 'Technology',
        tags: [
            { name: 'Gadgets', description: 'Latest news on tech gadgets.' },
            { name: 'AI', description: 'Updates on artificial intelligence.' },
            { name: 'Software', description: 'News on software developments.' },
            { name: 'Hardware', description: 'Updates on tech hardware.' },
            { name: 'Startups', description: 'News on tech startups.' },
            { name: 'Agents', description: 'AI Agents in technology.' }
        ]
    },
    {
        category: 'Finance',
        tags: [
            { name: 'Investing', description: 'Tips and news on investing.' },
            { name: 'Personal Finance', description: 'Advice on personal finance.' },
            { name: 'Stock Market', description: 'Updates on the stock market.' },
            { name: 'Cryptocurrency', description: 'News on cryptocurrencies.' },
            { name: 'Economy', description: 'Updates on the global economy.' },
            { name: 'Banking', description: 'News on banking and financial institutions.' }
        ]
    },
    {
        category: 'Travel',
        tags: [
            { name: 'Destinations', description: 'Guides to travel destinations.' },
            { name: 'Tips', description: 'Travel tips and advice.' },
            { name: 'Experiences', description: 'Travel experiences and stories.' },
            { name: 'Adventure', description: 'Adventure travel news and tips.' },
            { name: 'Budget Travel', description: 'Tips for budget travel.' },
            { name: 'Luxury Travel', description: 'News on luxury travel.' }
        ]
    },
    {
        category: 'Lifestyle',
        tags: [
            { name: 'Fashion', description: 'Latest news on fashion trends.' },
            { name: 'Beauty', description: 'Tips and news on beauty.' },
            { name: 'Home', description: 'Advice on home decor and living.' },
            { name: 'Relationships', description: 'Tips and advice on relationships.' },
            { name: 'Hot Gist', description: 'News and tips on wellness.' },
            { name: 'Hobbies', description: 'Ideas and news on hobbies.' }
        ]
    },
    {
        category: 'Food',
        tags: [
            { name: 'Recipes', description: 'Delicious recipes to try.' },
            { name: 'Restaurants', description: 'Reviews of restaurants.' },
            { name: 'Cooking Tips', description: 'Tips for cooking and baking.' },
            { name: 'Healthy Eating', description: 'Advice on healthy eating.' },
            { name: 'Food Trends', description: 'Latest trends in the food industry.' },
            { name: 'Cuisine', description: 'Exploring different cuisines.' }
        ]
    },
    {
        category: 'Sports',
        tags: [
            { name: 'Football', description: 'Latest news on football.' },
            { name: 'Basketball', description: 'Updates on basketball.' },
            { name: 'Tennis', description: 'News on tennis.' },
            { name: 'Cricket', description: 'Updates on cricket.' },
            { name: 'Olympics', description: 'News on the Olympic Games.' },
            { name: 'Athletics', description: 'Updates on athletics.' }
        ]
    },
    {
        category: 'Environment',
        tags: [
            { name: 'Climate Change', description: 'News on climate change.' },
            { name: 'Sustainability', description: 'Tips and news on sustainability.' },
            { name: 'Conservation', description: 'Updates on conservation efforts.' },
            { name: 'Wildlife', description: 'News on wildlife and habitats.' },
            { name: 'Pollution', description: 'Information on pollution and its effects.' },
            { name: 'Renewable Energy', description: 'News on renewable energy sources.' }
        ]
    },
    {
        category: 'Politics',
        tags: [
            { name: 'Elections', description: 'News on elections and voting.' },
            { name: 'Policies', description: 'Updates on political policies.' },
            { name: 'Government', description: 'News on government actions and decisions.' },
            { name: 'International Relations', description: 'Updates on international relations.' },
            { name: 'Legislation', description: 'News on new and proposed legislation.' },
            { name: 'Political Analysis', description: 'In-depth analysis of political events.' }
        ]
    }
];