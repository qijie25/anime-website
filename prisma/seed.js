const prisma = require("../src/models/prismaClient");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const users = [
  { email: "john@tester.com", username: "John01", password: "abc123" },
  { email: "jane@tester.com", username: "Jane01", password: "abc123" },
];

const anime = [
  {
    title: "Attack on Titan",
    description:
      "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations. After witnessing a horrific personal loss at the hands of the invading creatures, Eren Yeager dedicates his life to their eradication by enlisting into the Survey Corps, an elite military unit that combats the merciless humanoids outside the protection of the walls.",
    duration: 24,
    type: "TV Series",
    studios: "Wit Studio",
    date_aired: "2013-04-07T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/attack-on-titan.jpg",
    genre: "Action",
    total_episodes: 25,
  },
  {
    title: "Bleach",
    description:
      "Ichigo Kurosaki is an ordinary high schooler—until his family is attacked by a Hollow, a corrupt spirit that seeks to devour human souls. It is then that he meets a Soul Reaper named Rukia Kuchiki, who gets injured while protecting Ichigo's family from the assailant. To save his family, Ichigo accepts Rukia's offer of taking her powers and becomes a Soul Reaper as a result. However, as Rukia is unable to regain her powers, Ichigo is given the daunting task of hunting down the Hollows that plague their town. However, he is not alone in his fight, as he is later joined by his friends—classmates Orihime Inoue, Yasutora Sado, and Uryuu Ishida—who each have their own unique abilities. As Ichigo and his comrades get used to their new duties and support each other on and off the battlefield, the young Soul Reaper soon learns that the Hollows are not the only real threat to the human world.",
    duration: 24,
    type: "TV Series",
    studios: "Studio Pierrot",
    date_aired: "2004-10-05T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/bleach.jpg",
    genre: "Action",
    total_episodes: 366,
  },
  {
    title: "One Piece",
    description:
      "Gold Roger was known as the 'Pirate King,' the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King. Enter Monkey Luffy, a 17-year-old boy who defies your standard definition of a pirate. Rather than the popular persona of a wicked, hardened, toothless pirate ransacking villages for fun, Luffy's reason for being a pirate is one of pure wonder: the thought of an exciting adventure that leads him to intriguing people and ultimately, the promised treasure. Following in the footsteps of his childhood hero, Luffy and his crew travel across the Grand Line, experiencing crazy adventures, unveiling dark mysteries and battling strong enemies, all in order to reach the most coveted of all fortunes—One Piece.",
    duration: 24,
    type: "TV Series",
    studios: "Toei Animation",
    date_aired: "1999-10-20T08:05:06Z",
    status: "Currently Airing",
    img_url: "./assets/one-piece.jpg",
    genre: "Fantasy",
    total_episodes: 1122,
  },
  {
    title: "Dr. Stone",
    description:
      "After five years of harboring unspoken feelings, high-schooler Taiju Ooki is finally ready to confess his love to Yuzuriha Ogawa. Just when Taiju begins his confession however, a blinding green light strikes the Earth and petrifies mankind around the world—turning every single human into stone. Several millennia later, Taiju awakens to find the modern world completely nonexistent, as nature has flourished in the years humanity stood still. Among a stone world of statues, Taiju encounters one other living human: his science-loving friend Senkuu, who has been active for a few months. Taiju learns that Senkuu has developed a grand scheme—to launch the complete revival of civilization with science. Taiju's brawn and Senkuu's brains combine to forge a formidable partnership, and they soon uncover a method to revive those petrified. However, Senkuu's master plan is threatened when his ideologies are challenged by those who awaken. All the while, the reason for mankind's petrification remains unknown.",
    duration: 24,
    type: "TV Series",
    studios: "TMS Entertainment",
    date_aired: "2019-07-05T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/dr-stone.jpg",
    genre: "Adventure",
    total_episodes: 24,
  },
  {
    title: "Naruto",
    description:
      "Moments prior to Naruto Uzumaki's birth, a huge demon known as the Kyuubi, the Nine-Tailed Fox, attacked Konohagakure, the Hidden Leaf Village, and wreaked havoc. In order to put an end to the Kyuubi's rampage, the leader of the village, the Fourth Hokage, sacrificed his life and sealed the monstrous beast inside the newborn Naruto. Now, Naruto is a hyperactive and knuckle-headed ninja still living in Konohagakure. Shunned because of the Kyuubi inside him, Naruto struggles to find his place in the village, while his burning desire to become the Hokage of Konohagakure leads him not only to some great new friends, but also some deadly foes.",
    duration: 23,
    type: "TV Series",
    studios: "Studio Pierrot",
    date_aired: "2002-10-05T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/naruto.jpg",
    genre: "Shounen",
    total_episodes: 220,
  },
];

async function main() {
  await prisma.user.deleteMany();
  await prisma.anime.deleteMany();

  await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Anime_id_seq" RESTART WITH 1`;

  // Hash passwords and create persons
  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      email: user.email,
      username: user.username,
      password: await bcrypt.hash(user.password, saltRounds),
    }))
  );

  await prisma.user.createMany({
    data: hashedUsers,
  });

  const insertedUsers = await prisma.user.findMany();

  console.log(insertedUsers);

  await prisma.anime.createMany({
    data: anime,
  })

  const insertedAnime = await prisma.anime.findMany();

  console.log(insertedAnime);

  console.log("Seed data inserted successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
