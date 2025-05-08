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
    total_episodes: 220,
  },
  {
    title: "Sword Art Online",
    description:
      "In the year 2022, virtual reality has progressed by leaps and bounds, and a massive online role-playing game called Sword Art Online (SAO) is launched. With the aid of 'NerveGear' technology, players can control their avatars within the game using nothing but their own thoughts. Kazuto Kirigaya, nicknamed 'Kirito,' is among the lucky few enthusiasts who get their hands on the first shipment of the game. He logs in to find himself, with ten-thousand others, in the scenic and elaborate world of Aincrad, one full of fantastic medieval weapons and gruesome monsters. However, in a cruel turn of events, the players soon realize they cannot log out; the game's creator has trapped them in his new world until they complete all one hundred levels of the game. In order to escape Aincrad, Kirito will now have to interact and cooperate with his fellow players. Some are allies, while others are foes, like Asuna Yuuki, who commands the leading group attempting to escape from the ruthless game. To make matters worse, Sword Art Online is not all fun and games: if they die in Aincrad, they die in real life. Kirito must adapt to his new reality, fight for his survival, and hopefully break free from his virtual hell.",
    duration: 24,
    type: "TV Series",
    studios: "A-1 Pictures",
    date_aired: "2012-07-08T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/sword-art-online.jpg",
    total_episodes: 25,
  },
  {
    title: "Bungo Stray Dogs",
    description:
      "For weeks, Atsushi Nakajima's orphanage has been plagued by a mystical tiger that only he seems to be aware of. Suspected to be behind the strange incidents, the 18-year-old is abruptly kicked out of the orphanage and left hungry, homeless, and wandering through the city. While starving on a riverbank, Atsushi saves a rather eccentric man named Osamu Dazai from drowning. Whimsical suicide enthusiast and supernatural detective, Dazai has been investigating the same tiger that has been terrorizing the boy. Together with Dazai's partner Doppo Kunikida, they solve the mystery, but its resolution leaves Atsushi in a tight spot. As various odd events take place, Atsushi is coerced into joining their firm of supernatural investigators, taking on unusual cases the police cannot handle, alongside his numerous enigmatic co-workers.",
    duration: 24,
    type: "TV Series",
    studios: "Bones",
    date_aired: "2016-04-07T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/bungo-stray-dogs.jpg",
    total_episodes: 12,
  },
  {
    title: "Tokyo Ghoul",
    description:
      "Tokyo has become a cruel and merciless city—a place where vicious creatures called 'ghouls' exist alongside humans. The citizens of this once great metropolis live in constant fear of these bloodthirsty savages and their thirst for human flesh. However, the greatest threat these ghouls pose is their dangerous ability to masquerade as humans and blend in with society. Based on the best-selling supernatural horror manga by Sui Ishida, Tokyo Ghoul follows Ken Kaneki, a shy, bookish college student, who is instantly drawn to Rize Kamishiro, an avid reader like himself. However, Rize is not exactly who she seems, and this unfortunate meeting pushes Kaneki into the dark depths of the ghouls' inhuman world. In a twist of fate, Kaneki is saved by the enigmatic waitress Touka Kirishima, and thus begins his new, secret life as a half-ghoul/half-human who must find a way to integrate into both societies.",
    duration: 24,
    type: "TV Series",
    studios: "Studio Pierrot",
    date_aired: "2014-07-04T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/tokyo-ghoul.jpg",
    total_episodes: 12,
  },
  {
    title: "Vinland Saga",
    description:
      "Young Thorfinn grew up listening to the stories of old sailors that had traveled the ocean and reached the place of legend, Vinland. It's said to be warm and fertile, a place where there would be no need for fighting—not at all like the frozen village in Iceland where he was born, and certainly not like his current life as a mercenary. War is his home now. Though his father once told him, 'You have no enemies, nobody does. There is nobody who it's okay to hurt,' as he grew, Thorfinn knew that nothing was further from the truth. The war between England and the Danes grows worse with each passing year. Death has become commonplace, and the viking mercenaries are loving every moment of it. Allying with either side will cause a massive swing in the balance of power, and the vikings are happy to make names for themselves and take any spoils they earn along the way. Among the chaos, Thorfinn must take his revenge and kill Askeladd, the man who murdered his father. The only paradise for the vikings, it seems, is the era of war and death that rages on.",
    duration: 24,
    type: "TV Series",
    studios: "Wit Studio",
    date_aired: "2019-07-08T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/vinland-saga.jpg",
    total_episodes: 24,
  },
  {
    title: "One Punch Man",
    description:
      "The seemingly ordinary and unimpressive Saitama has a rather unique hobby: being a hero. In order to pursue his childhood dream, he trained relentlessly for three years—and lost all of his hair in the process. Now, Saitama is incredibly powerful, so much so that no enemy is able to defeat him in battle. In fact, all it takes to defeat evildoers with just one punch has led to an unexpected problem—he is no longer able to enjoy the thrill of battling and has become quite bored. This all changes with the arrival of Genos, a 19-year-old cyborg, who wishes to be Saitama's disciple after seeing what he is capable of. Genos proposes that the two join the Hero Association in order to become certified heroes that will be recognized for their positive contributions to society, and Saitama, shocked that no one knows who he is, quickly agrees. And thus begins the story of One Punch Man, an action-comedy that follows an eccentric individual who longs to fight strong enemies that can hopefully give him the excitement he once felt and just maybe, he'll become popular in the process.",
    duration: 24,
    type: "TV Series",
    studios: "Madhouse",
    date_aired: "2015-10-05T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/one-punch-man.jpg",
    total_episodes: 12,
  },
  {
    title: "Gintama",
    description:
      "The Amanto, aliens from outer space, have invaded Earth and taken over feudal Japan. As a result, a prohibition on swords has been established, and the samurai of Japan are treated with disregard as a consequence. However one man, Gintoki Sakata, still possesses the heart of the samurai, although from his love of sweets and work as a yorozuya, one might not expect it. Accompanying him in his jack-of-all-trades line of work are Shinpachi Shimura, a boy with glasses and a strong heart, Kagura with her umbrella and seemingly bottomless stomach, as well as Sadaharu, their oversized pet dog. Of course, these odd jobs are not always simple, as they frequently have run-ins with the police, ragtag rebels, and assassins, oftentimes leading to humorous but unfortunate consequences. Who said life as an errand boy was easy?",
    duration: 24,
    type: "TV Series",
    studios: "Sunrise",
    date_aired: "2006-04-04T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/gintama.jpg",
    total_episodes: 201,
  },
  {
    title: "My Hero Academia",
    description:
      "The appearance of 'quirks,' newly discovered super powers, has been steadily increasing over the years, with 80 percent of humanity possessing various abilities from manipulation of elements to shapeshifting. This leaves the remainder of the world completely powerless, and Izuku Midoriya is one such individual. Since he was a child, the ambitious middle schooler has wanted nothing more than to be a hero. Izuku's unfair fate leaves him admiring heroes and taking notes on them whenever he can. But it seems that his persistence has borne some fruit: Izuku meets the number one hero and his personal idol, All Might. All Might's quirk is a unique ability that can be inherited, and he has chosen Izuku to be his successor! Enduring many months of grueling training, Izuku enrolls in UA High, a prestigious high school famous for its excellent hero training program, and this year's freshmen look especially promising. With his bizarre but talented classmates and the looming threat of a villainous organization, Izuku will soon learn what it really means to be a hero.",
    duration: 24,
    type: "TV Series",
    studios: "Bones",
    date_aired: "2016-04-03T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/my-hero-academia.jpg",
    total_episodes: 13,
    season: 2,
  },
  {
    title: "Jujutsu Kaisen",
    description:
      "Idly indulging in baseless paranormal activities with the Occult Club, high schooler Yuuji Itadori spends his days at either the clubroom or the hospital, where he visits his bedridden grandfather. However, this leisurely lifestyle soon takes a turn for the strange when he unknowingly encounters a cursed item. Triggering a chain of supernatural occurrences, Yuuji finds himself suddenly thrust into the world of Curses—dreadful beings formed from human malice and negativity—after swallowing the said item, revealed to be a finger belonging to the demon Sukuna Ryoumen, the 'King of Curses.' Yuuji experiences first-hand the threat these Curses pose to society as he discovers his own newfound powers. Introduced to the Tokyo Metropolitan Jujutsu Technical High School, he begins to walk down a path from which he cannot return—the path of a Jujutsu sorcerer.",
    duration: 23,
    type: "TV Series",
    studios: "MAPPA",
    date_aired: "2020-10-03T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/jujutsu-kaisen.jpg",
    total_episodes: 24,
  },
  {
    title: "Demon Slayer",
    description:
      "Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado's shoulders. Though living impoverished on a remote mountain, the Kamado family are able to enjoy a relatively peaceful and happy life. One day, Tanjirou decides to go down to the local village to make a little money selling charcoal. On his way back, night falls, forcing Tanjirou to take shelter in the house of a strange man, who warns him of the existence of flesh-eating demons that lurk in the woods at night. When he finally arrives back home the next day, he is met with a horrifying sight—his whole family has been slaughtered. Worse still, the sole survivor is his sister Nezuko, who has been turned into a bloodthirsty demon. Consumed by rage and hatred, Tanjirou swears to avenge his family and stay by his only remaining sibling. Alongside the mysterious group calling themselves the Demon Slayer Corps, Tanjirou will do whatever it takes to slay the demons and protect the remnants of his beloved sister's humanity.",
    duration: 23,
    type: "TV Series",
    studios: "ufotable",
    date_aired: "2019-04-06T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/demon-slayer.jpg",
    total_episodes: 26,
  },
  {
    title: "Fullmetal Alchemist",
    description:
      "Edward Elric, a young, brilliant alchemist, has lost much in his twelve-year life: when he and his brother Alphonse try to resurrect their dead mother through the forbidden act of human transmutation, Edward loses his brother as well as two of his limbs. With his supreme alchemy skills, Edward binds Alphonse's soul to a large suit of armor. A year later, Edward, now promoted to the fullmetal alchemist of the state, embarks on a journey with his younger brother to obtain the Philosopher's Stone. The fabled mythical object is rumored to be capable of amplifying an alchemist's abilities by leaps and bounds, thus allowing them to override the fundamental law of alchemy: to gain something, an alchemist must sacrifice something of equal value. Edward hopes to draw into the military's resources to find the fabled stone and restore his and Alphonse's bodies to normal. However, the Elric brothers soon discover that there is more to the legendary stone than meets the eye, as they are led to the epicenter of a far darker battle than they could have ever imagined.",
    duration: 24,
    type: "TV Series",
    studios: "Bones",
    date_aired: "2003-10-04T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/fullmetal-alchemist.jpg",
    total_episodes: 51,
  },
  {
    title: "Hunter x Hunter",
    description:
      "Hunter x Hunter is set in a world where Hunters exist to perform all manner of dangerous tasks like capturing criminals and bravely searching for lost treasures in uncharted territories. Twelve-year-old Gon Freecss is determined to become the best Hunter possible in hopes of finding his father, who was a Hunter himself and had long ago abandoned his young son. However, Gon soon realizes the path to achieving his goals is far more challenging than he could have ever imagined. Along the way to becoming an official Hunter, Gon befriends the lively doctor-in-training Leorio, vengeful Kurapika, and rebellious ex-assassin Killua. To attain their own goals and desires, together the four of them take the Hunter Exam, notorious for its low success rate and high probability of death. Throughout their journey, Gon and his friends embark on an adventure that puts them through many hardships and struggles. They will meet a plethora of monsters, creatures, and characters—all while learning what being a Hunter truly means.",
    duration: 24,
    type: "TV Series",
    studios: "Madhouse",
    date_aired: "2011-10-02T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/hunter-x-hunter.jpg",
    total_episodes: 100,
  },
  {
    title: "Steins;Gate",
    description:
      "The self-proclaimed mad scientist Rintarou Okabe rents out a room in a rickety old building in Akihabara, where he indulges himself in his hobby of inventing prospective 'future gadgets' with fellow lab members: Mayuri Shiina, his air-headed childhood friend, and Hashida Itaru, a perverted hacker nicknamed 'Daru.' The three pass the time by tinkering with their most promising contraption yet, a machine dubbed the 'Phone Microwave,' which performs the strange function of morphing bananas into piles of green gel. Though miraculous in itself, the phenomenon doesn't provide anything concrete in Okabe's search for a scientific breakthrough; that is, until the lab members are spurred into action by a string of mysterious happenings before stumbling upon an unexpected success—the Phone Microwave can send emails to the past, altering the flow of history. Adapted from the critically acclaimed visual novel by 5pb. and Nitroplus, Steins;Gate takes Okabe through the depths of scientific theory and practicality. Forced across the diverging threads of past and present, Okabe must shoulder the burdens that come with holding the key to the realm of time.",
    duration: 24,
    type: "TV Series",
    studios: "White Fox",
    date_aired: "2011-04-06T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/steins-gate.jpg",
    total_episodes: 24,
  },
  {
    title: "Your Lie in April",
    description:
      "Music accompanies the path of the human metronome, the prodigious pianist Kousei Arima. But after the passing of his mother, Saki Arima, Kousei falls into a downward spiral, rendering him unable to hear the sound of his own piano. Two years later, Kousei still avoids the piano, leaving behind his admirers and rivals, and lives a colorless life alongside his friends Tsubaki Sawabe and Ryouta Watari. However, everything changes when he meets a beautiful violinist, Kaori Miyazono, who stirs up his world and sets him on a journey to face music again. Based on the manga series of the same name, Shigatsu wa Kimi no Uso approaches the story of Kousei's recovery as he discovers that music is more than playing each note perfectly, and a single melody can bring in the fresh spring air of April.",
    duration: 22,
    type: "TV Series",
    studios: "A-1 Pictures",
    date_aired: "2014-10-10T08:05:06Z",
    status: "Finished Airing",
    img_url: "./assets/your-lie-in-april.jpg",
    total_episodes: 22,
  },
  {
    title: "Devil May Cry",
    description:
      "When a mysterious villain threatens to open the gates of Hell, a devilishly handsome demon hunter could be the world's best hope for salvation.",
    duration: 30,
    type: "TV Series",
    studios: "Netflix",
    date_aired: "2025-04-03T08:05:06Z",
    status: "Currently Airing",
    img_url: "./assets/devil-may-cry.jpg",
  },
  {
    title: "Super Cube",
    description:
      "In an accident, an ordinary boy, Wang Xiaoxiu, obtains a space system called 'Superpower Cube' from a high-latitude cosmic civilization and gains extraordinary powers. When the school belle, Shen Yao, Wang Xiaoxiu’s longtime crush, confesses her love to him, the delinquent Sun Jun, who also has a crush on her, is provoked. Wang Xiaoxiu resolves the crisis with his wit and extraordinary powers, but it also brings more disasters as a result. Shen Yao is taken to the world of extraordinary beings by a mysterious person, and Wang Xiaoxiu embarks on a journey to rescue her. Fighting in the bizarre universe, he finds the meaning of fairness and justice on the path to becoming a peerless powerhouse.",
    duration: 20,
    type: "TV Series",
    studios: "Big Firebird Culture",
    date_aired: "2025-03-21T08:05:06Z",
    status: "Currently Airing",
    img_url: "./assets/super-cube.jpg",
  },
  {
    title: "The Beginning After the End",
    description:
      "The story follows the strongest king in history, Grey. Although he possesses unparalleled power, wealth, and fame, there is no one who stands by his side…and he trusts no one. One day, Grey suddenly meets his death and is reincarnated as a powerless infant named Arthur in a world of magic. Surrounded by a loving family and companions, Arthur starts to experience joys in this new life that he never knew in his previous one. However, during a journey, his family is attacked by bandits... Thus begins his second life, filled with love and adventure!",
    duration: 24,
    type: "TV Series",
    studios: "Studio A-CAT",
    date_aired: "2025-04-02T08:05:06Z",
    status: "Currently Airing",
    img_url: "./assets/tbate.jpg",
  },
  {
    title: "Lazarus",
    description:
      "The year is 2052—an era of unprecedented peace and prosperity prevails across the globe. The reason for this: mankind has been freed from sickness and pain. Nobel Prize winning neuroscientist Dr. Skinner has developed a miracle cure-all drug with no apparent drawbacks called Hapuna. Hapuna soon becomes ubiquitous... and essential. However, soon after Hapuna is officially introduced, Dr. Skinner vanishes. Three years later, the world has moved on. But Dr. Skinner has returned—this time, as a harbinger of doom. Skinner announces that Hapuna has a short half-life. Everyone who has taken it will die approximately three years later. Death is coming for this sinful world—and coming soon. As a response to this threat, a special task force of 5 agents is gathered from across the world to save humanity from Skinner’s plan. This group is called 'Lazarus.' Can they find Skinner and develop a vaccine before time runs out?",
    duration: 24,
    type: "TV Series",
    studios: "MAPPA",
    date_aired: "2025-04-06T08:05:06Z",
    status: "Currently Airing",
    img_url: "./assets/lazarus.jpg",
  },
  {
    title: "To Be Hero X",
    description:
      "This is a world where heroes are created by people's trust, and the hero who has received the most trust is known as - X. In this world, people's trust can be calculated by data, and these values will be reflected on everyone's wrist. As long as enough trust points are obtained, ordinary people can also have superpowers and become superheroes that save the world. However, the ever-changing trust value makes the hero's path full of unknowns...",
    duration: 24,
    type: "TV Series",
    studios: "LAN Studio",
    date_aired: "2025-04-06T08:05:06Z",
    status: "Currently Airing",
    img_url: "./assets/to-be-hero-x.jpg",
  },
  {
    title: "The Unaware Atelier Master",
    description:
      "One day, Kurt, a kind-hearted boy, is suddenly kicked out of the Hero's Party for being 'useless.' He finds that his aptitude for weapons, magic, and all other combat-related skills is the lowest rand, so he takes odd-jobs repairing the castle walls and digging for minerals, where his exceptional abilities are immediately revealed. He proves to be skillful in cooking, building, mining, crafting magical tools—in fact, his aptitude for every skill unrelated to combat had an SSS-ranking! Kurt, however, seems completely unaware to his talent and ends up saving people, the town, and even the country through his unaware actions!?",
    duration: 24,
    type: "TV Series",
    studios: "EMT Squared",
    date_aired: "2025-04-06T08:05:06Z",
    status: "Currently Airing",
    img_url: "./assets/the-unaware-atelier.jpg",
  },
  {
    title: "Food for the Soul",
    description:
      "An original animation about the daily life of five girls who just became university students. They love delicious food, want to have lots of fun with everyone, and study a little harder to enjoy university life to the fullest!",
    duration: 24,
    type: "TV Series",
    studios: "P.A. Works",
    date_aired: "2025-04-13T08:05:06Z",
    status: "Currently Airing",
    img_url: "./assets/food-for-the-soul.jpg",
  },
  {
    title: "Kowloon Generic Romance",
    description:
      "In the distant future, individuals who adore the old way of life live in Kowloon Walled City—a slum city that serves as a refuge for those who long for the Hong Kong of the past. Realtor Reiko Kujirai, however, craves for the new and exciting places in the area. In contrast, her only coworker, Hajime Kudou, enjoys the nostalgia the city invokes and is put off by anything modern that seeps past its walls. But despite their differing views and constant bickering on the most mundane of things, the two often find themselves enjoying each other's company. One day, a prank gone wrong leads Hajime to make an unexpected advance toward Reiko, after which he swiftly apologizes for. Baffled by his actions, Reiko starts investigating for possible explanations, only to discover a past that she has no memory of.",
    duration: 24,
    type: "TV Series",
    studios: "Arvo Animation",
    date_aired: "2025-04-05T08:05:06Z",
    status: "Currently Airing",
    img_url: "./assets/kowloon-generic-romance.jpg",
  },
  {
    title: "Teogonia",
    description:
      "It's a time of warfare where relentless battles continue between human and demi-human tribes like the Ash Monkeys (Macaque) and pig people (Ogres) invading human lands. Kai, a boy from the village of Rag, spends his days immersed in battle to protect his village. Amidst the harsh battles enforced by those possessing immense power known as 'guardian bearers,' and as his comrades fall one by one, Kai suddenly recalls memories he shouldn't have experienced—memories of a world with advanced technology and knowledge of people's lives beyond this world. And thus, although Kai was just a villager, he soon finds himself embroiled in great trials... A magnificent fantasy tale unfolds, chronicling the struggle and growth of a single boy in a harsh world.",
    duration: 24,
    type: "TV Series",
    studios: "Asahi Production",
    date_aired: "2025-04-12T08:05:06Z",
    status: "Currently Airing",
    img_url: "./assets/teogonia.jpg",
  },
  {
    title: "Your Forma",
    description:
      "In an alternate 2023, the Your Forma, a miraculous 'smart thread' technology initially developed to treat a massive outbreak of viral encephalitis, has become an integral part of daily life. But these convenient devices come with an invasive drawback—they record every sight, sound, and even emotion their users experience. For electronic investigator Echika Hieda, diving into peoples' memories via the Your Forma and hunting for evidence to solve the toughest crimes is all part of a day's work. The problem is, she's so good at what she does that her assistants literally fry their brains trying to keep up with her. After putting one too many aides in the hospital, the top brass finally furnish Echika with a partner on her level, a brilliant yet cheeky android named Harold Lucraft. Does this unlikely duo have what it takes to resolve their mutual suspicions and avert a deadly technological infection from sweeping across the globe before it's too late?",
    duration: 24,
    type: "TV Series",
    studios: "Geno Studio",
    date_aired: "2025-04-02T08:05:06Z",
    status: "Currently Airing",
    img_url: "./assets/your-forma.jpg",
  },
];

const genres = [
  { name: "Action" },
  { name: "Adventure" },
  { name: "Fantasy" },
  { name: "Shounen" },
  { name: "Horror" },
  { name: "Drama" },
  { name: "Comedy" },
  { name: "Sci-Fi" },
  { name: "Romance" },
  { name: "Psychological" },
  { name: "Thriller" },
  { name: "Mystery" },
  { name: "Slice of Life" },
  { name: "Sports" },
  { name: "Supernatural" },
  { name: "Historical" },
  { name: "Isekai"},
  { name: "Super Power"},
];

const animeGenresMap = {
  "Jujutsu Kaisen": ["Action", "Shounen"],
  "Attack on Titan": ["Action", "Drama", "Horror"],
  "Demon Slayer": ["Action", "Fantasy"],
  "One Piece": ["Action", "Adventure"],
  "Naruto": ["Action", "Adventure"],
  "Death Note": ["Mystery", "Thriller", "Psychological"],
  "Fullmetal Alchemist": ["Action", "Fantasy", "Drama"],
  "Tokyo Ghoul": ["Horror", "Action", "Psychological"],
  "My Hero Academia": ["Action", "Shounen"],
  "Hunter x Hunter": ["Action", "Adventure"],
  "Steins;Gate": ["Sci-Fi", "Psychological"],
  "Your Lie in April": ["Romance", "Drama"],
  "Bleach": ["Action", "Adventure"],
  "Dr. Stone": ["Comedy", "Adventure"],
  "Sword Art Online": ["Action", "Fantasy", "Drama"],
  "Bungo Stray Dogs": ["Action", "Comedy", "Mystery"],
  "Vinland Saga": ["Action", "Adventure"],
  "One Punch Man": ["Action", "Comedy", "Sci-Fi"],
  "Gintama": ["Action", "Comedy", "Sci-Fi"],
  "Devil May Cry": ["Action", "Fantasy", "Supernatural"],
  "Super Cube": ["Action", "Adventure", "Fantasy"],
  "The Beginning After the End": ["Action", "Adventure", "Fantasy"],
  "Lazarus": ["Action", "Sci-Fi"],
  "To Be Hero X": ["Action", "Super Power"],
  "The Unaware Atelier Master": ["Action", "Adventure", "Fantasy"],
  "Food for the Soul": ["Slice of Life"],
  "Kowloon Generic Romance": ["Romance", "Slice of Life", "Mystery"],
  "Teogonia": ["Action", "Adventure", "Fantasy"],
  "Your Forma": ["Sci-Fi", "Mystery", "Drama"],
};

const animeRating = [
  { animeId: 1, userId: 1, score: 6 },
  { animeId: 2, userId: 2, score: 7 },
  { animeId: 3, userId: 1, score: 8 },
  { animeId: 4, userId: 2, score: 9 },
  { animeId: 5, userId: 1, score: 7 },
  { animeId: 6, userId: 2, score: 6 },
  { animeId: 7, userId: 1, score: 7 },
  { animeId: 8, userId: 2, score: 8 },
  { animeId: 9, userId: 1, score: 9 },
  { animeId: 10, userId: 2, score: 7 },
  { animeId: 1, userId: 2, score: 7 },
  { animeId: 2, userId: 1, score: 5 },
  { animeId: 3, userId: 2, score: 4 },
  { animeId: 4, userId: 1, score: 8 },
  { animeId: 5, userId: 2, score: 6 },
  { animeId: 6, userId: 1, score: 9 },
  { animeId: 7, userId: 2, score: 5 },
  { animeId: 8, userId: 1, score: 7 },
  { animeId: 9, userId: 2, score: 2 },
  { animeId: 10, userId: 1, score: 9 },
];

async function main() {
  await prisma.message.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.anime.deleteMany();
  await prisma.genre.deleteMany();

  await prisma.$executeRaw`ALTER SEQUENCE "Message_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Rating_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Admin_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Anime_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Genre_id_seq" RESTART WITH 1`;

  const adminUser = {
    email: "dexter@anitube.com",
    username: "Dexter",
    password: "password123",
  };

  const allUsers = [...users, adminUser];

  for (const user of allUsers) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        username: user.username,
        password: hashedPassword,
      },
    });
  }

  // Link Admin role to admin user
  const admin = await prisma.user.findUnique({
    where: { email: adminUser.email },
  });

  await prisma.admin.upsert({
    where: { user_id: admin.id },
    update: {},
    create: {
      user_id: admin.id,
    },
  });

  await prisma.anime.createMany({
    data: anime,
  });

  await prisma.genre.createMany({
    data: genres,
  });

  await prisma.rating.createMany({
    data: animeRating,
  });

  const allGenres = await prisma.genre.findMany();
  const allAnimes = await prisma.anime.findMany();

  for (const anime of allAnimes) {
    const genreNames = animeGenresMap[anime.title];
    if (!genreNames) continue;

    const genreLinks = genreNames.map((name) => {
      const genre = allGenres.find((g) => g.name === name);
      return {
        animeId: anime.id,
        genreId: genre.id,
      };
    });

    await prisma.animeGenre.createMany({ data: genreLinks });
  }

  // Fetch grouped rating data: avg and count per animeId
  const ratingStats = await prisma.rating.groupBy({
    by: ["animeId"],
    _avg: {
      score: true,
    },
    _count: {
      score: true,
    },
  });

  // Update each anime with avgRating and totalRatings
  for (const stat of ratingStats) {
    await prisma.anime.update({
      where: { id: stat.animeId },
      data: {
        avgRating: parseFloat(stat._avg.score.toFixed(1)),
        totalRatings: stat._count.score,
      },
    });
  }

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
