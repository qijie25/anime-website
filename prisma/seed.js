const prisma = require('../src/models/prismaClient');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const users = [
  { email: 'john@tester.com', username: 'John01', password: 'abc123' },
  { email: 'jane@tester.com', username: 'Jane01', password: 'abc123' },
];

const anime = [
  {
    title: 'Attack on Titan',
    description:
      'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations. After witnessing a horrific personal loss at the hands of the invading creatures, Eren Yeager dedicates his life to their eradication by enlisting into the Survey Corps, an elite military unit that combats the merciless humanoids outside the protection of the walls.',
    duration: 24,
    type: 'TV Series',
    studios: 'Wit Studio',
    date_aired: '2013-04-07T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/attack-on-titan.jpg',
    total_episodes: 25,
    date_finished: '2013-09-29T08:05:06Z',
  },
  {
    title: 'Bleach',
    description:
      "Ichigo Kurosaki is an ordinary high schooler—until his family is attacked by a Hollow, a corrupt spirit that seeks to devour human souls. It is then that he meets a Soul Reaper named Rukia Kuchiki, who gets injured while protecting Ichigo's family from the assailant. To save his family, Ichigo accepts Rukia's offer of taking her powers and becomes a Soul Reaper as a result. However, as Rukia is unable to regain her powers, Ichigo is given the daunting task of hunting down the Hollows that plague their town. However, he is not alone in his fight, as he is later joined by his friends—classmates Orihime Inoue, Yasutora Sado, and Uryuu Ishida—who each have their own unique abilities. As Ichigo and his comrades get used to their new duties and support each other on and off the battlefield, the young Soul Reaper soon learns that the Hollows are not the only real threat to the human world.",
    duration: 24,
    type: 'TV Series',
    studios: 'Studio Pierrot',
    date_aired: '2004-10-05T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/bleach.jpg',
    total_episodes: 366,
    date_finished: '2012-03-27T08:05:06Z',
  },
  {
    title: 'One Piece',
    description:
      "Gold Roger was known as the 'Pirate King,' the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King. Enter Monkey Luffy, a 17-year-old boy who defies your standard definition of a pirate. Rather than the popular persona of a wicked, hardened, toothless pirate ransacking villages for fun, Luffy's reason for being a pirate is one of pure wonder: the thought of an exciting adventure that leads him to intriguing people and ultimately, the promised treasure. Following in the footsteps of his childhood hero, Luffy and his crew travel across the Grand Line, experiencing crazy adventures, unveiling dark mysteries and battling strong enemies, all in order to reach the most coveted of all fortunes—One Piece.",
    duration: 24,
    type: 'TV Series',
    studios: 'Toei Animation',
    date_aired: '1999-10-20T08:05:06Z',
    status: 'Currently Airing',
    img_url: './assets/one-piece.jpg',
    total_episodes: 1122,
  },
  {
    title: 'Dr. Stone',
    description:
      "After five years of harboring unspoken feelings, high-schooler Taiju Ooki is finally ready to confess his love to Yuzuriha Ogawa. Just when Taiju begins his confession however, a blinding green light strikes the Earth and petrifies mankind around the world—turning every single human into stone. Several millennia later, Taiju awakens to find the modern world completely nonexistent, as nature has flourished in the years humanity stood still. Among a stone world of statues, Taiju encounters one other living human: his science-loving friend Senkuu, who has been active for a few months. Taiju learns that Senkuu has developed a grand scheme—to launch the complete revival of civilization with science. Taiju's brawn and Senkuu's brains combine to forge a formidable partnership, and they soon uncover a method to revive those petrified. However, Senkuu's master plan is threatened when his ideologies are challenged by those who awaken. All the while, the reason for mankind's petrification remains unknown.",
    duration: 24,
    type: 'TV Series',
    studios: 'TMS Entertainment',
    date_aired: '2019-07-05T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/dr-stone.jpg',
    total_episodes: 24,
    date_finished: '2019-12-13T08:05:06Z',
  },
  {
    title: 'Naruto',
    description:
      "Moments prior to Naruto Uzumaki's birth, a huge demon known as the Kyuubi, the Nine-Tailed Fox, attacked Konohagakure, the Hidden Leaf Village, and wreaked havoc. In order to put an end to the Kyuubi's rampage, the leader of the village, the Fourth Hokage, sacrificed his life and sealed the monstrous beast inside the newborn Naruto. Now, Naruto is a hyperactive and knuckle-headed ninja still living in Konohagakure. Shunned because of the Kyuubi inside him, Naruto struggles to find his place in the village, while his burning desire to become the Hokage of Konohagakure leads him not only to some great new friends, but also some deadly foes.",
    duration: 23,
    type: 'TV Series',
    studios: 'Studio Pierrot',
    date_aired: '2002-10-05T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/naruto.jpg',
    total_episodes: 220,
    date_finished: '2007-02-07T08:05:06Z',
  },
  {
    title: 'Sword Art Online',
    description:
      "In the year 2022, virtual reality has progressed by leaps and bounds, and a massive online role-playing game called Sword Art Online (SAO) is launched. With the aid of 'NerveGear' technology, players can control their avatars within the game using nothing but their own thoughts. Kazuto Kirigaya, nicknamed 'Kirito,' is among the lucky few enthusiasts who get their hands on the first shipment of the game. He logs in to find himself, with ten-thousand others, in the scenic and elaborate world of Aincrad, one full of fantastic medieval weapons and gruesome monsters. However, in a cruel turn of events, the players soon realize they cannot log out; the game's creator has trapped them in his new world until they complete all one hundred levels of the game. In order to escape Aincrad, Kirito will now have to interact and cooperate with his fellow players. Some are allies, while others are foes, like Asuna Yuuki, who commands the leading group attempting to escape from the ruthless game. To make matters worse, Sword Art Online is not all fun and games: if they die in Aincrad, they die in real life. Kirito must adapt to his new reality, fight for his survival, and hopefully break free from his virtual hell.",
    duration: 24,
    type: 'TV Series',
    studios: 'A-1 Pictures',
    date_aired: '2012-07-08T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/sword-art-online.jpg',
    total_episodes: 25,
    date_finished: '2012-12-23T08:05:06Z',
  },
  {
    title: 'Bungo Stray Dogs',
    description:
      "For weeks, Atsushi Nakajima's orphanage has been plagued by a mystical tiger that only he seems to be aware of. Suspected to be behind the strange incidents, the 18-year-old is abruptly kicked out of the orphanage and left hungry, homeless, and wandering through the city. While starving on a riverbank, Atsushi saves a rather eccentric man named Osamu Dazai from drowning. Whimsical suicide enthusiast and supernatural detective, Dazai has been investigating the same tiger that has been terrorizing the boy. Together with Dazai's partner Doppo Kunikida, they solve the mystery, but its resolution leaves Atsushi in a tight spot. As various odd events take place, Atsushi is coerced into joining their firm of supernatural investigators, taking on unusual cases the police cannot handle, alongside his numerous enigmatic co-workers.",
    duration: 24,
    type: 'TV Series',
    studios: 'Bones',
    date_aired: '2016-04-07T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/bungo-stray-dogs.jpg',
    total_episodes: 12,
    date_finished: '2016-06-23T08:05:06Z',
  },
  {
    title: 'Tokyo Ghoul',
    description:
      "Tokyo has become a cruel and merciless city—a place where vicious creatures called 'ghouls' exist alongside humans. The citizens of this once great metropolis live in constant fear of these bloodthirsty savages and their thirst for human flesh. However, the greatest threat these ghouls pose is their dangerous ability to masquerade as humans and blend in with society. Based on the best-selling supernatural horror manga by Sui Ishida, Tokyo Ghoul follows Ken Kaneki, a shy, bookish college student, who is instantly drawn to Rize Kamishiro, an avid reader like himself. However, Rize is not exactly who she seems, and this unfortunate meeting pushes Kaneki into the dark depths of the ghouls' inhuman world. In a twist of fate, Kaneki is saved by the enigmatic waitress Touka Kirishima, and thus begins his new, secret life as a half-ghoul/half-human who must find a way to integrate into both societies.",
    duration: 24,
    type: 'TV Series',
    studios: 'Studio Pierrot',
    date_aired: '2014-07-04T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/tokyo-ghoul.jpg',
    total_episodes: 12,
    date_finished: '2014-09-19T08:05:06Z',
  },
  {
    title: 'Vinland Saga',
    description:
      "Young Thorfinn grew up listening to the stories of old sailors that had traveled the ocean and reached the place of legend, Vinland. It's said to be warm and fertile, a place where there would be no need for fighting—not at all like the frozen village in Iceland where he was born, and certainly not like his current life as a mercenary. War is his home now. Though his father once told him, 'You have no enemies, nobody does. There is nobody who it's okay to hurt,' as he grew, Thorfinn knew that nothing was further from the truth. The war between England and the Danes grows worse with each passing year. Death has become commonplace, and the viking mercenaries are loving every moment of it. Allying with either side will cause a massive swing in the balance of power, and the vikings are happy to make names for themselves and take any spoils they earn along the way. Among the chaos, Thorfinn must take his revenge and kill Askeladd, the man who murdered his father. The only paradise for the vikings, it seems, is the era of war and death that rages on.",
    duration: 24,
    type: 'TV Series',
    studios: 'Wit Studio',
    date_aired: '2019-07-08T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/vinland-saga.jpg',
    total_episodes: 24,
    date_finished: '2019-12-15T08:05:06Z',
  },
  {
    title: 'One Punch Man',
    description:
      "The seemingly ordinary and unimpressive Saitama has a rather unique hobby: being a hero. In order to pursue his childhood dream, he trained relentlessly for three years—and lost all of his hair in the process. Now, Saitama is incredibly powerful, so much so that no enemy is able to defeat him in battle. In fact, all it takes to defeat evildoers with just one punch has led to an unexpected problem—he is no longer able to enjoy the thrill of battling and has become quite bored. This all changes with the arrival of Genos, a 19-year-old cyborg, who wishes to be Saitama's disciple after seeing what he is capable of. Genos proposes that the two join the Hero Association in order to become certified heroes that will be recognized for their positive contributions to society, and Saitama, shocked that no one knows who he is, quickly agrees. And thus begins the story of One Punch Man, an action-comedy that follows an eccentric individual who longs to fight strong enemies that can hopefully give him the excitement he once felt and just maybe, he'll become popular in the process.",
    duration: 24,
    type: 'TV Series',
    studios: 'Madhouse',
    date_aired: '2015-10-05T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/one-punch-man.jpg',
    total_episodes: 12,
    date_finished: '2015-12-12T08:05:06Z',
  },
  {
    title: 'Gintama',
    description:
      'The Amanto, aliens from outer space, have invaded Earth and taken over feudal Japan. As a result, a prohibition on swords has been established, and the samurai of Japan are treated with disregard as a consequence. However one man, Gintoki Sakata, still possesses the heart of the samurai, although from his love of sweets and work as a yorozuya, one might not expect it. Accompanying him in his jack-of-all-trades line of work are Shinpachi Shimura, a boy with glasses and a strong heart, Kagura with her umbrella and seemingly bottomless stomach, as well as Sadaharu, their oversized pet dog. Of course, these odd jobs are not always simple, as they frequently have run-ins with the police, ragtag rebels, and assassins, oftentimes leading to humorous but unfortunate consequences. Who said life as an errand boy was easy?',
    duration: 24,
    type: 'TV Series',
    studios: 'Sunrise',
    date_aired: '2006-04-04T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/gintama.jpg',
    total_episodes: 201,
    date_finished: '2010-03-25T08:05:06Z',
  },
  {
    title: 'My Hero Academia',
    description:
      "The appearance of 'quirks,' newly discovered super powers, has been steadily increasing over the years, with 80 percent of humanity possessing various abilities from manipulation of elements to shapeshifting. This leaves the remainder of the world completely powerless, and Izuku Midoriya is one such individual. Since he was a child, the ambitious middle schooler has wanted nothing more than to be a hero. Izuku's unfair fate leaves him admiring heroes and taking notes on them whenever he can. But it seems that his persistence has borne some fruit: Izuku meets the number one hero and his personal idol, All Might. All Might's quirk is a unique ability that can be inherited, and he has chosen Izuku to be his successor! Enduring many months of grueling training, Izuku enrolls in UA High, a prestigious high school famous for its excellent hero training program, and this year's freshmen look especially promising. With his bizarre but talented classmates and the looming threat of a villainous organization, Izuku will soon learn what it really means to be a hero.",
    duration: 24,
    type: 'TV Series',
    studios: 'Bones',
    date_aired: '2016-04-03T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/my-hero-academia.jpg',
    total_episodes: 13,
    season: 2,
    date_finished: '2016-06-23T08:05:06Z',
  },
  {
    title: 'Jujutsu Kaisen',
    description:
      "Idly indulging in baseless paranormal activities with the Occult Club, high schooler Yuuji Itadori spends his days at either the clubroom or the hospital, where he visits his bedridden grandfather. However, this leisurely lifestyle soon takes a turn for the strange when he unknowingly encounters a cursed item. Triggering a chain of supernatural occurrences, Yuuji finds himself suddenly thrust into the world of Curses—dreadful beings formed from human malice and negativity—after swallowing the said item, revealed to be a finger belonging to the demon Sukuna Ryoumen, the 'King of Curses.' Yuuji experiences first-hand the threat these Curses pose to society as he discovers his own newfound powers. Introduced to the Tokyo Metropolitan Jujutsu Technical High School, he begins to walk down a path from which he cannot return—the path of a Jujutsu sorcerer.",
    duration: 23,
    type: 'TV Series',
    studios: 'MAPPA',
    date_aired: '2020-10-03T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/jujutsu-kaisen.jpg',
    total_episodes: 24,
    date_finished: '2021-03-27T08:05:06Z',
  },
  {
    title: 'Demon Slayer: Kimetsu no Yaiba',
    description:
      "Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado's shoulders. Though living impoverished on a remote mountain, the Kamado family are able to enjoy a relatively peaceful and happy life. One day, Tanjirou decides to go down to the local village to make a little money selling charcoal. On his way back, night falls, forcing Tanjirou to take shelter in the house of a strange man, who warns him of the existence of flesh-eating demons that lurk in the woods at night. When he finally arrives back home the next day, he is met with a horrifying sight—his whole family has been slaughtered. Worse still, the sole survivor is his sister Nezuko, who has been turned into a bloodthirsty demon. Consumed by rage and hatred, Tanjirou swears to avenge his family and stay by his only remaining sibling. Alongside the mysterious group calling themselves the Demon Slayer Corps, Tanjirou will do whatever it takes to slay the demons and protect the remnants of his beloved sister's humanity.",
    duration: 23,
    type: 'TV Series',
    studios: 'ufotable',
    date_aired: '2019-04-06T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/demon-slayer.jpg',
    total_episodes: 26,
    date_finished: '2019-10-04T08:05:06Z',
  },
  {
    title: 'Fullmetal Alchemist',
    description:
      "Edward Elric, a young, brilliant alchemist, has lost much in his twelve-year life: when he and his brother Alphonse try to resurrect their dead mother through the forbidden act of human transmutation, Edward loses his brother as well as two of his limbs. With his supreme alchemy skills, Edward binds Alphonse's soul to a large suit of armor. A year later, Edward, now promoted to the fullmetal alchemist of the state, embarks on a journey with his younger brother to obtain the Philosopher's Stone. The fabled mythical object is rumored to be capable of amplifying an alchemist's abilities by leaps and bounds, thus allowing them to override the fundamental law of alchemy: to gain something, an alchemist must sacrifice something of equal value. Edward hopes to draw into the military's resources to find the fabled stone and restore his and Alphonse's bodies to normal. However, the Elric brothers soon discover that there is more to the legendary stone than meets the eye, as they are led to the epicenter of a far darker battle than they could have ever imagined.",
    duration: 24,
    type: 'TV Series',
    studios: 'Bones',
    date_aired: '2003-10-04T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/fullmetal-alchemist.jpg',
    total_episodes: 51,
    date_finished: '2004-10-02T08:05:06Z',
  },
  {
    title: 'Hunter x Hunter',
    description:
      'Hunter x Hunter is set in a world where Hunters exist to perform all manner of dangerous tasks like capturing criminals and bravely searching for lost treasures in uncharted territories. Twelve-year-old Gon Freecss is determined to become the best Hunter possible in hopes of finding his father, who was a Hunter himself and had long ago abandoned his young son. However, Gon soon realizes the path to achieving his goals is far more challenging than he could have ever imagined. Along the way to becoming an official Hunter, Gon befriends the lively doctor-in-training Leorio, vengeful Kurapika, and rebellious ex-assassin Killua. To attain their own goals and desires, together the four of them take the Hunter Exam, notorious for its low success rate and high probability of death. Throughout their journey, Gon and his friends embark on an adventure that puts them through many hardships and struggles. They will meet a plethora of monsters, creatures, and characters—all while learning what being a Hunter truly means.',
    duration: 24,
    type: 'TV Series',
    studios: 'Madhouse',
    date_aired: '2011-10-02T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/hunter-x-hunter.jpg',
    total_episodes: 100,
    date_finished: '2014-09-24T08:05:06Z',
  },
  {
    title: 'Steins;Gate',
    description:
      "The self-proclaimed mad scientist Rintarou Okabe rents out a room in a rickety old building in Akihabara, where he indulges himself in his hobby of inventing prospective 'future gadgets' with fellow lab members: Mayuri Shiina, his air-headed childhood friend, and Hashida Itaru, a perverted hacker nicknamed 'Daru.' The three pass the time by tinkering with their most promising contraption yet, a machine dubbed the 'Phone Microwave,' which performs the strange function of morphing bananas into piles of green gel. Though miraculous in itself, the phenomenon doesn't provide anything concrete in Okabe's search for a scientific breakthrough; that is, until the lab members are spurred into action by a string of mysterious happenings before stumbling upon an unexpected success—the Phone Microwave can send emails to the past, altering the flow of history. Adapted from the critically acclaimed visual novel by 5pb. and Nitroplus, Steins;Gate takes Okabe through the depths of scientific theory and practicality. Forced across the diverging threads of past and present, Okabe must shoulder the burdens that come with holding the key to the realm of time.",
    duration: 24,
    type: 'TV Series',
    studios: 'White Fox',
    date_aired: '2011-04-06T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/steins-gate.jpg',
    total_episodes: 24,
    date_finished: '2011-09-14T08:05:06Z',
  },
  {
    title: 'Your Lie in April',
    description:
      "Music accompanies the path of the human metronome, the prodigious pianist Kousei Arima. But after the passing of his mother, Saki Arima, Kousei falls into a downward spiral, rendering him unable to hear the sound of his own piano. Two years later, Kousei still avoids the piano, leaving behind his admirers and rivals, and lives a colorless life alongside his friends Tsubaki Sawabe and Ryouta Watari. However, everything changes when he meets a beautiful violinist, Kaori Miyazono, who stirs up his world and sets him on a journey to face music again. Based on the manga series of the same name, Shigatsu wa Kimi no Uso approaches the story of Kousei's recovery as he discovers that music is more than playing each note perfectly, and a single melody can bring in the fresh spring air of April.",
    duration: 22,
    type: 'TV Series',
    studios: 'A-1 Pictures',
    date_aired: '2014-10-10T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/your-lie-in-april.jpg',
    total_episodes: 22,
    date_finished: '2015-03-08T08:05:06Z',
  },
  {
    title: 'Devil May Cry',
    description:
      "When a mysterious villain threatens to open the gates of Hell, a devilishly handsome demon hunter could be the world's best hope for salvation.",
    duration: 30,
    type: 'TV Series',
    studios: 'Netflix',
    date_aired: '2025-04-03T08:05:06Z',
    status: 'Currently Airing',
    img_url: './assets/devil-may-cry.jpg',
  },
  {
    title: 'Super Cube',
    description:
      "In an accident, an ordinary boy, Wang Xiaoxiu, obtains a space system called 'Superpower Cube' from a high-latitude cosmic civilization and gains extraordinary powers. When the school belle, Shen Yao, Wang Xiaoxiu’s longtime crush, confesses her love to him, the delinquent Sun Jun, who also has a crush on her, is provoked. Wang Xiaoxiu resolves the crisis with his wit and extraordinary powers, but it also brings more disasters as a result. Shen Yao is taken to the world of extraordinary beings by a mysterious person, and Wang Xiaoxiu embarks on a journey to rescue her. Fighting in the bizarre universe, he finds the meaning of fairness and justice on the path to becoming a peerless powerhouse.",
    duration: 20,
    type: 'TV Series',
    studios: 'Big Firebird Culture',
    date_aired: '2025-03-21T08:05:06Z',
    status: 'Currently Airing',
    img_url: './assets/super-cube.jpg',
  },
  {
    title: 'The Beginning After the End',
    description:
      'The story follows the strongest king in history, Grey. Although he possesses unparalleled power, wealth, and fame, there is no one who stands by his side…and he trusts no one. One day, Grey suddenly meets his death and is reincarnated as a powerless infant named Arthur in a world of magic. Surrounded by a loving family and companions, Arthur starts to experience joys in this new life that he never knew in his previous one. However, during a journey, his family is attacked by bandits... Thus begins his second life, filled with love and adventure!',
    duration: 24,
    type: 'TV Series',
    studios: 'Studio A-CAT',
    date_aired: '2025-04-02T08:05:06Z',
    status: 'Currently Airing',
    img_url: './assets/tbate.jpg',
  },
  {
    title: 'Lazarus',
    description:
      "The year is 2052—an era of unprecedented peace and prosperity prevails across the globe. The reason for this: mankind has been freed from sickness and pain. Nobel Prize winning neuroscientist Dr. Skinner has developed a miracle cure-all drug with no apparent drawbacks called Hapuna. Hapuna soon becomes ubiquitous... and essential. However, soon after Hapuna is officially introduced, Dr. Skinner vanishes. Three years later, the world has moved on. But Dr. Skinner has returned—this time, as a harbinger of doom. Skinner announces that Hapuna has a short half-life. Everyone who has taken it will die approximately three years later. Death is coming for this sinful world—and coming soon. As a response to this threat, a special task force of 5 agents is gathered from across the world to save humanity from Skinner’s plan. This group is called 'Lazarus.' Can they find Skinner and develop a vaccine before time runs out?",
    duration: 24,
    type: 'TV Series',
    studios: 'MAPPA',
    date_aired: '2025-04-06T08:05:06Z',
    status: 'Currently Airing',
    img_url: './assets/lazarus.jpg',
  },
  {
    title: 'To Be Hero X',
    description:
      "This is a world where heroes are created by people's trust, and the hero who has received the most trust is known as - X. In this world, people's trust can be calculated by data, and these values will be reflected on everyone's wrist. As long as enough trust points are obtained, ordinary people can also have superpowers and become superheroes that save the world. However, the ever-changing trust value makes the hero's path full of unknowns...",
    duration: 24,
    type: 'TV Series',
    studios: 'LAN Studio',
    date_aired: '2025-04-06T08:05:06Z',
    status: 'Currently Airing',
    img_url: './assets/to-be-hero-x.jpg',
  },
  {
    title: 'The Unaware Atelier Master',
    description:
      "One day, Kurt, a kind-hearted boy, is suddenly kicked out of the Hero's Party for being 'useless.' He finds that his aptitude for weapons, magic, and all other combat-related skills is the lowest rand, so he takes odd-jobs repairing the castle walls and digging for minerals, where his exceptional abilities are immediately revealed. He proves to be skillful in cooking, building, mining, crafting magical tools—in fact, his aptitude for every skill unrelated to combat had an SSS-ranking! Kurt, however, seems completely unaware to his talent and ends up saving people, the town, and even the country through his unaware actions!?",
    duration: 24,
    type: 'TV Series',
    studios: 'EMT Squared',
    date_aired: '2025-04-06T08:05:06Z',
    status: 'Currently Airing',
    img_url: './assets/the-unaware-atelier.jpg',
  },
  {
    title: 'Food for the Soul',
    description:
      'An original animation about the daily life of five girls who just became university students. They love delicious food, want to have lots of fun with everyone, and study a little harder to enjoy university life to the fullest!',
    duration: 24,
    type: 'TV Series',
    studios: 'P.A. Works',
    date_aired: '2025-04-13T08:05:06Z',
    status: 'Currently Airing',
    img_url: './assets/food-for-the-soul.jpg',
  },
  {
    title: 'Kowloon Generic Romance',
    description:
      "In the distant future, individuals who adore the old way of life live in Kowloon Walled City—a slum city that serves as a refuge for those who long for the Hong Kong of the past. Realtor Reiko Kujirai, however, craves for the new and exciting places in the area. In contrast, her only coworker, Hajime Kudou, enjoys the nostalgia the city invokes and is put off by anything modern that seeps past its walls. But despite their differing views and constant bickering on the most mundane of things, the two often find themselves enjoying each other's company. One day, a prank gone wrong leads Hajime to make an unexpected advance toward Reiko, after which he swiftly apologizes for. Baffled by his actions, Reiko starts investigating for possible explanations, only to discover a past that she has no memory of.",
    duration: 24,
    type: 'TV Series',
    studios: 'Arvo Animation',
    date_aired: '2025-04-05T08:05:06Z',
    status: 'Currently Airing',
    img_url: './assets/kowloon-generic-romance.jpg',
  },
  {
    title: 'Teogonia',
    description:
      "It's a time of warfare where relentless battles continue between human and demi-human tribes like the Ash Monkeys (Macaque) and pig people (Ogres) invading human lands. Kai, a boy from the village of Rag, spends his days immersed in battle to protect his village. Amidst the harsh battles enforced by those possessing immense power known as 'guardian bearers,' and as his comrades fall one by one, Kai suddenly recalls memories he shouldn't have experienced—memories of a world with advanced technology and knowledge of people's lives beyond this world. And thus, although Kai was just a villager, he soon finds himself embroiled in great trials... A magnificent fantasy tale unfolds, chronicling the struggle and growth of a single boy in a harsh world.",
    duration: 24,
    type: 'TV Series',
    studios: 'Asahi Production',
    date_aired: '2025-04-12T08:05:06Z',
    status: 'Currently Airing',
    img_url: './assets/teogonia.jpg',
  },
  {
    title: 'Your Forma',
    description:
      "In an alternate 2023, the Your Forma, a miraculous 'smart thread' technology initially developed to treat a massive outbreak of viral encephalitis, has become an integral part of daily life. But these convenient devices come with an invasive drawback—they record every sight, sound, and even emotion their users experience. For electronic investigator Echika Hieda, diving into peoples' memories via the Your Forma and hunting for evidence to solve the toughest crimes is all part of a day's work. The problem is, she's so good at what she does that her assistants literally fry their brains trying to keep up with her. After putting one too many aides in the hospital, the top brass finally furnish Echika with a partner on her level, a brilliant yet cheeky android named Harold Lucraft. Does this unlikely duo have what it takes to resolve their mutual suspicions and avert a deadly technological infection from sweeping across the globe before it's too late?",
    duration: 24,
    type: 'TV Series',
    studios: 'Geno Studio',
    date_aired: '2025-04-02T08:05:06Z',
    status: 'Currently Airing',
    img_url: './assets/your-forma.jpg',
  },
  {
    title: 'Black Clover',
    description:
      "Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the 'Wizard King'—a title given to the strongest mage in the kingdom—and promised that they would compete against each other for the position of the next Wizard King. However, as they grew up, the stark difference between them became evident. While Yuno is able to wield magic with amazing power and control, Asta cannot use magic at all and desperately tries to awaken his powers by training physically. When they reach the age of 15, Yuno is bestowed a spectacular Grimoire with a four-leaf clover, while Asta receives nothing. However, soon after, Yuno is attacked by a person named Lebuty, whose main purpose is to obtain Yuno's Grimoire. Asta tries to fight Lebuty, but he is outmatched. Though without hope and on the brink of defeat, he finds the strength to continue when he hears Yuno's voice. Unleashing his inner emotions in a rage, Asta receives a five-leaf clover Grimoire, a 'lack Clover' giving him enough power to defeat Lebuty. A few days later, the two friends head out into the world, both seeking the same goal—to become the Wizard King!",
    duration: 24,
    type: 'TV Series',
    studios: 'Studio Pierrot',
    date_aired: '2017-10-03T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/black-clover.jpg',
    total_episodes: 170,
    date_finished: '2021-03-30T08:05:06Z',
  },
  {
    title: 'Black Clover: Sword of the Wizard King',
    description:
      'As a lionhearted boy who can’t wield magic strives for the title of Wizard King, four banished Wizard Kings of yore return to crush the Clover Kingdom.',
    duration: 110,
    type: 'Movie',
    studios: 'Studio Pierrot',
    date_aired: '2023-06-16T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/black-clover-movie.jpg',
  },
  {
    title: 'Sword Art Online: Progressive',
    description:
      "'There's no way to beat this game. The only difference is when and where you die...' One month has passed since Akihiko Kayaba's deadly game began, and the body count continues to rise. Two thousand players are already dead. Kirito and Asuna are two very different people, but they both desire to fight alone. Nonetheless, they find themselves drawn together to face challenges from both within and without. Given that the entire virtual world they now live in has been created as a deathtrap, the surviving players of Sword Art Online are starting to get desperate, and desperation makes them dangerous to loners like Kirito and Asuna. As it becomes clear that solitude equals suicide, will the two be able to overcome their differences to find the strength to believe in each other, and in so doing survive? Sword Art Online: Progressive is a new version of the Sword Art Online tale that starts at the beginning of Kirito and Asuna's epic adventure—on the very first level of the deadly world of Aincrad!",
    duration: 98,
    type: 'Movie',
    studios: 'A-1 Pictures',
    date_aired: '2021-10-30T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/SAO-movie.jpg',
  },
  {
    title: 'The Seven Deadly Sins',
    description:
      "In a world similar to the European Middle Ages, the feared yet revered Holy Knights of Britannia use immensely powerful magic to protect the region of Britannia and its kingdoms. However, a small subset of the Knights supposedly betrayed their homeland and turned their blades against their comrades in an attempt to overthrow the ruler of Liones. They were defeated by the Holy Knights, but rumors continued to persist that these legendary knights, called the 'Seven Deadly Sins,' were still alive. Ten years later, the Holy Knights themselves staged a coup d’état, and thus became the new, tyrannical rulers of the Kingdom of Liones. Based on the best-selling manga series of the same name, Nanatsu no Taizai follows the adventures of Elizabeth, the third princess of the Kingdom of Liones, and her search for the Seven Deadly Sins. With their help, she endeavors to not only take back her kingdom from the Holy Knights, but to also seek justice in an unjust world.",
    duration: 24,
    type: 'TV Series',
    studios: 'A-1 Pictures',
    date_aired: '2014-10-05T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/seven-deadly-sins.jpg',
    total_episodes: 24,
    date_finished: '2015-03-29T08:05:06Z',
  },
  {
    title: 'The Seven Deadly Sins: Prisoners of the Sky',
    description:
      "In search of a mystical ingredient known as Sky Fish, Meliodas and Hawk stumble upon a spring that suddenly transports them to the Sky Temple: a breathtaking land above the clouds, inhabited by beings called Celestials. Meliodas, however, looks strikingly similar to a local criminal called Solaad, and is imprisoned and shunned as a result. Meanwhile, the kingdom of the Sky Temple prepares to defend the Great Oshiro's seal—said to harbour a three thousand-year-old evil—from the malevolent Six Knights of Black, a group of demons who seek to destroy the seal. However, the Demon Clan is successfully unleashed and terrorizes the land, prompting the remaining Seven Deadly Sins and the Celestials to fight against their wicked foes. The battle progresses well, until one of the Six Knights awakens an 'Indura of Retribution,' an uncontrollable beast from the Demon Realm. With its overwhelming strength and sinister power, the Seven Deadly Sins and Celestial beings must now work together to defeat the creature that threatens their very existence.",
    duration: 99,
    type: 'Movie',
    studios: 'A-1 Pictures',
    date_aired: '2018-08-18T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/seven-deadly-sins-movie.jpg',
  },
  {
    title: 'Demon Slayer: Mugen Train',
    description:
      "After a string of mysterious disappearances begin to plague a train, the Demon Slayer Corps' multiple attempts to remedy the problem prove fruitless. To prevent further casualties, the flame pillar, Kyoujurou Rengoku, takes it upon himself to eliminate the threat. Accompanying him are some of the Corps' most promising new blood: Tanjirou Kamado, Zenitsu Agatsuma, and Inosuke Hashibira, who all hope to witness the fiery feats of this model demon slayer firsthand. Unbeknownst to them, the demonic forces responsible for the disappearances have already put their sinister plan in motion. Under this demonic presence, the group must muster every ounce of their willpower and draw their swords to save all two hundred passengers onboard. Kimetsu no Yaiba Movie: Mugen Ressha-hen delves into the deepest corners of Tanjirou's mind, putting his resolve and commitment to duty to the test.",
    duration: 117,
    type: 'Movie',
    studios: 'ufotable',
    date_aired: '2020-10-16T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/demon-slayer-movie.jpg',
  },
  {
    title: 'One Piece Film: Red',
    description:
      "As a child, Uta—the Red Hair Pirates' ex-musician and Monkey D. Luffy's childhood friend—promised that she would build a new era of freedom by performing joyful music for the world. Luffy and the Straw Hat Crew arrive at Uta's first ever live concert, where many fans have gathered to enjoy the diva's otherworldly singing. Due to a childhood trauma, Uta bears a deep-seated hatred for pirates; her happy reunion with Luffy is cut short when she learns that he has since become one. Luffy's refusal to change his ways results in Uta unleashing her powers on the Straw Hats. The crew soon learns that their minds have already been trapped in Uta's dream world since the beginning of the concert, while their unconscious bodies remain asleep in the real world. With time quickly running out, the Straw Hats must find a way to escape the nightmare or be trapped in Uta's dream forever.",
    duration: 115,
    type: 'Movie',
    studios: 'Toei Animation',
    date_aired: '2022-08-06T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/one-piece-movie.jpg',
  },
  {
    title: 'Blue Box',
    description:
      "Every morning, incoming first-year Taiki Inomata hurries to his high school gym in order to further refine his badminton skills. However, his true motivation stems from sharing the otherwise empty gym with second-year Chinatsu Kano, Taiki's crush and the star player of the girls' basketball team. Although Chinatsu seems unapproachable, Taiki gradually finds opportunities to get to know her little by little. Unbeknownst to Taiki, his tireless work ethic and admiration motivate Chinatsu to work harder and strive to achieve her greatest ambitions. When her family must suddenly move overseas for work, Chinatsu decides to remain in Japan and shoot for victory at the national level. With nowhere to stay, she is taken in by Taiki's mother, who is longtime friends with Chinatsu's own. Overwhelmed with the new reality of living alongside the girl he loves, Taiki resolves to join Chinatsu at the national level in his own sport—and grow closer to her in the process. Still, despite being good enough to catch his coach's eye, Taiki must fight an uphill battle to qualify for a spot on the starting team. Cheered on by both Chinatsu and gymnast Hina Chouno, his childhood friend, Taiki aims to make a name for himself among his powerful upperclassmen.",
    duration: 24,
    type: 'TV Series',
    studios: 'Telecom Animation Film',
    date_aired: '2024-10-03T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/blue-box.jpg',
    total_episodes: 25,
    date_finished: '2025-03-20T08:05:06Z',
  },
  {
    title: 'Amagami SS',
    description:
      'Two years ago, Junichi Tachibana had a date on Christmas Eve but was stood up instead. Since then, he has had a hard time showing others his true feelings in fear of being rejected again. However, as luck would have it, Junichi may have a second chance at love when he meets several girls whom he becomes romantically interested in: Haruka Morishima, the energetic and popular upperclassman with a love for cute things; Kaoru Tanamachi, his childhood friend who harbors secret feelings for him; Sae Nakata, the timid transfer student who is shy around men; Ai Nanasaki, a girl on the swim team who has a bad first impression of Junichi; Rihoko Sakurai, a childhood friend with a love for sweets; and Tsukasa Ayatsuji, a seemingly perfect class representative who has a hidden dark side. As Christmas Eve approaches, Junichi can only hope that this will be the year he will finally spend the holidays with the one he truly loves.',
    duration: 24,
    type: 'TV Series',
    studios: 'AIC',
    date_aired: '2010-07-02T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/amagami-ss.jpg',
    total_episodes: 25,
    date_finished: '2010-12-24T08:05:06Z',
  },
  {
    title: 'Citrus',
    description:
      "During the summer of her freshman year of high school, Yuzu Aihara's mother remarried, forcing her to transfer to a new school. To a fashionable socialite like Yuzu, this inconvenient event is just another opportunity to make new friends, fall in love, and finally experience a first kiss. Unfortunately, Yuzu's dreams and style do not conform with her new ultrastrict, all-girls school, filled with obedient shut-ins and overachieving grade-skippers. Her gaudy appearance manages to grab the attention of Mei Aihara, the beautiful and imposing student council president, who immediately proceeds to sensually caress Yuzu's body in an effort to confiscate her cellphone. Thoroughly exhausted from her first day, Yuzu arrives home and discovers a shocking truth—Mei is actually her new step-sister! Though Yuzu initially tries to be friendly with her, Mei's cold shoulder routine forces Yuzu to begin teasing her. But before Yuzu can finish her sentence, Mei forces her to the ground and kisses her, with Yuzu desperately trying to break free. Once done, Mei storms out of the room, leaving Yuzu to ponder the true nature of her first kiss, and the secrets behind the tortured expression in the eyes of her new sister.",
    duration: 24,
    type: 'TV Series',
    studios: 'Passione',
    date_aired: '2018-01-06T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/citrus.jpg',
    total_episodes: 12,
    date_finished: '2018-03-24T08:05:06Z',
  },
  {
    title: 'Persona 5: The Animation',
    description:
      "Ren Amamiya, a new transfer student at Shujin Academy, is sent to Tokyo to live with his family friend Sojiro Sakura after wrongly being put on probation for defending a woman from sexual assault. While on the way to attend his first day at his new school, Ren notices a strange app has appeared on his phone, transferring him to a world known as the Metaverse, which contains people's 'shadows': distorted depictions of their true selves. In the Metaverse, he awakens his Persona, a power from deep within that gives him the strength to fight the shadows. With the help of similarly troubled students, he forms the Phantom Thieves of Hearts, attempting to save people from their sinful desires by 'taking their heart,' making evildoers regret their actions and turn over a new leaf. The group's reputation continues to grow explosively, bringing along fame both positive and negative. However, during the peak of their popularity, Ren gets captured and taken into custody. Here, he wakes up to a harsh interrogation, but this is cut short by the arrival of Sae Niijima—a prosecutor seeking answers. Just how will she react to his story, and what will become of the Phantom Thieves?",
    duration: 24,
    type: 'TV Series',
    studios: 'CloverWorks',
    date_aired: '2018-04-08T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/persona5.jpg',
    total_episodes: 26,
    date_finished: '2018-09-24T08:05:06Z',
  },
  {
    title: 'Angels of Death',
    description:
      "With dead and lifeless eyes, Rachel Gardner wishes only to die. Waking up in the basement of a building, she has no idea how or why she's there. She stumbles across a bandaged murderer named Zack, who is trying to escape. After promising to kill her as soon as he is free, Rachel and Zack set out to ascend through the building floor by floor until they escape. However, as they progress upward, they meet more twisted people, and all of them seem familiar with Rachel. What is her connection to the building, and why was she placed in it? Facing a new boss on each floor, can Rachel and Zack both achieve their wishes?",
    duration: 24,
    type: 'TV Series',
    studios: 'J.C.Staff',
    date_aired: '2018-07-06T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/angels-of-death.jpg',
    total_episodes: 16,
    date_finished: '2018-09-26T08:05:06Z',
  },
  {
    title: "Komi Can't Communicate",
    description:
      "It's Shouko Komi's first day at the prestigious Itan Private High School, and she has already risen to the status of the school's Madonna. With long black hair and a tall, graceful appearance, she captures the attention of anyone who comes across her. There's just one problem though—despite her popularity, Shouko is terrible at communicating with others. Hitohito Tadano is your average high school boy. With his life motto of 'read the situation and make sure to stay away from trouble,' he quickly finds that sitting next to Shouko has made him the enemy of everyone in his class! One day, knocked out by accident, Hitohito later wakes up to the sound of Shouko's 'meow.' He lies that he heard nothing, causing Shouko to run away. But before she can escape, Hitohito surmises that Shouko is not able to talk to others easily—in fact, she has never been able to make a single friend. Hitohito resolves to help Shouko with her goal of making one hundred friends so that she can overcome her communication disorder.",
    duration: 24,
    type: 'TV Series',
    studios: 'Half H.P Studio',
    date_aired: '2021-10-07T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/komi-cant-communicate.jpg',
    total_episodes: 12,
    date_finished: '2021-12-03T08:05:06Z',
  },
  {
    title: 'Spare Me, Great Lord!',
    description:
      'This is the story of an orphan, Lu Shu. He is not any regular orphan, but a metahuman experiencing the changes in himself, his country and the world during the dawn of the magical era. Watch as Lu Shu embarks on a journey to hone his peculiar abilities together with his sister, the adorable and charismatic Lu Xiaoyu. Along the way, they’ll encounter supernatural events, obstacles and even the most powerful people in their country. How will Lu Shu make the best of his abilities and oust his never-ending list of rivals and opponents?',
    duration: 24,
    type: 'TV Series',
    studios: 'Big Firebird Culture',
    date_aired: '2021-12-03T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/spare-me-great-lord.jpg',
    total_episodes: 12,
    date_finished: '2022-02-11T08:05:06Z',
  },
  {
    title: 'Spirit Chronicles',
    description:
      "Amakawa Haruto is a young man who died before reuniting with his childhood friend who disappeared five years ago. Rio is a boy living in the slums who wants revenge for his mother who was murdered in front of him when he was five years old. Earth and another world. Two people with completely different backgrounds and values. For some reason, the memories and personality of Haruto who should've died is resurrected in Rio's body. As the two are confused over their memories and personalities fusing together, Rio decides to live in this new world. Along with Haruto's memories, Rio awakens an unknown 'special power,' and it seems that if he uses it well, he can live a better life. But before that, Rio encounters a kidnapping that turns out to be of a princess of the Bertram Kingdom that he lives in. After saving the princess, Rio is given a scholarship at the Royal Academy, a school for the rich and powerful. Being a poor orphan in a school of nobles turns out to be an extremely detestable place to be.",
    duration: 24,
    type: 'TV Series',
    studios: 'MediaNet',
    date_aired: '2021-07-05T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/spirit-chronicles.jpg',
    total_episodes: 12,
    date_finished: '2021-09-10T08:05:06Z',
  },
  {
    title: 'Record of Ragnarok',
    description:
      "High above the realm of man, the gods of the world have convened to decide on a single matter: the continued existence of mankind. Under the head of Zeus, the deities of Ancient Greece, Norse mythology, and Hinduism, among others, call assembly every one thousand years to decide the fate of humanity. Because of their unrelenting abuse toward each other and the planet, this time the gods vote unanimously in favor of ending the human race. But before the mandate passes, Brunhild, one of the 13 demigod Valkyries, puts forth an alternate proposal: rather than anticlimactically annihilating mankind, why not give them a fighting chance and enact Ragnarök, a one-on-one showdown between man and god? Spurred on by the audacity of the challenge, the divine council quickly accepts, fully confident that this contest will display the utter might of the gods. To stand a chance against the mighty heavens, Brunhild will need to assemble history's greatest individuals, otherwise the death knell will surely be sounded for mankind.",
    duration: 24,
    type: 'TV Series',
    studios: 'Graphinica',
    date_aired: '2021-06-17T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/record-of-ragnarok.jpg',
    total_episodes: 12,
    date_finished: '2021-09-10T08:05:06Z',
  },
  {
    title: 'Rascal Does Not Dream of Bunny Girl Senpai',
    description:
      'The rare and inexplicable Puberty Syndrome is thought of as a myth. It is a rare disease which only affects teenagers, and its symptoms are so supernatural that hardly anyone recognizes it as a legitimate occurrence. However, high school student Sakuta Azusagawa knows from personal experience that it is very much real, and happens to be quite prevalent in his school. Mai Sakurajima is a third-year high school student who gained fame in her youth as a child actress, but recently halted her promising career for reasons unknown to the public. With an air of unapproachability, she is well known throughout the school, but none dare interact with her—that is until Sakuta sees her wandering the library in a bunny girl costume. Despite the getup, no one seems to notice her, and after confronting her, he realizes that she is another victim of Puberty Syndrome. As Sakuta tries to help Mai through her predicament, his actions bring him into contact with more girls afflicted with the elusive disease.',
    duration: 24,
    type: 'TV Series',
    studios: 'CloverWorks',
    date_aired: '2018-10-04T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/rascal-does-not-dream-of-bunny-girl.jpg',
    total_episodes: 13,
    date_finished: '2019-02-17T08:05:06Z',
  },
  {
    title: 'Rascal Does Not Dream of a Dreaming Girl',
    description:
      "Six months ago, Sakuta Azusagawa had a chance encounter with a bunny girl in a library. Ever since then, he’s been blissfully happy with his girlfriend: Mai Sakurajima, that same bunny girl. However, the reappearance of his mysterious first crush, the now-adult Shouko Makinohara, adds a new complication to his relationship with Mai. To make matters worse, he then encounters a middle school Shouko in the hospital, suffering from a grave illness. Mysteriously, his old scars begin throbbing whenever he’s near her. With Shouko’s bizarre situation somehow revolving around him, Sakuta will need to come to terms with his own conflicting feelings, for better or worse. With a girl's life in his hands, just what can he do?",
    duration: 90,
    type: 'Movie',
    studios: 'CloverWorks',
    date_aired: '2019-06-15T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/rascal-does-not-dream-of-a-dreaming-girl.jpg',
  },
  {
    title: 'Another',
    description:
      "In 1972, a popular student in Yomiyama North Middle School's class 3-3 named Misaki passed away during the school year. Since then, the town of Yomiyama has been shrouded by a fearful atmosphere, from the dark secrets hidden deep within. Twenty-six years later, 15-year-old Kouichi Sakakibara transfers into class 3-3 of Yomiyama North and soon after discovers that a strange, gloomy mood seems to hang over all the students. He also finds himself drawn to the mysterious, eyepatch-wearing student Mei Misaki; however, the rest of the class and the teachers seem to treat her like she doesn't exist. Paying no heed to warnings from everyone including Mei herself, Kouichi begins to get closer not only to her, but also to the truth behind the gruesome phenomenon plaguing class 3-3 of Yomiyama North. Another follows Kouichi, Mei, and their classmates as they are pulled into the enigma surrounding a series of inevitable, tragic events—but unraveling the horror of Yomiyama may just cost them the ultimate price.",
    duration: 24,
    type: 'TV Series',
    studios: 'P.A Works',
    date_aired: '2012-01-10T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/another.jpg',
    total_episodes: 12,
    date_finished: '2012-03-27T08:05:06Z',
  },
  {
    title: 'Haikyu!!',
    description:
      "Inspired after watching a volleyball ace nicknamed 'Little Giant' in action, small-statured Shouyou Hinata revives the volleyball club at his middle school. The newly-formed team even makes it to a tournament; however, their first match turns out to be their last when they are brutally squashed by the 'King of the Court,' Tobio Kageyama. Hinata vows to surpass Kageyama, and so after graduating from middle school, he joins Karasuno High School's volleyball team—only to find that his sworn rival, Kageyama, is now his teammate. Thanks to his short height, Hinata struggles to find his role on the team, even with his superior jumping power. Surprisingly, Kageyama has his own problems that only Hinata can help with, and learning to work together appears to be the only way for the team to be successful. Based on Haruichi Furudate's popular shounen manga of the same name, Haikyuu!! is an exhilarating and emotional sports comedy following two determined athletes as they attempt to patch a heated rivalry in order to make their high school volleyball team the best in Japan.",
    duration: 24,
    type: 'TV Series',
    studios: 'Production I.G',
    date_aired: '2014-04-06T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/haikyu.jpg',
    total_episodes: 25,
    date_finished: '2014-09-26T08:05:06Z',
  },
  {
    title: 'Barakamon',
    description:
      "Seishuu Handa is an up-and-coming calligrapher: young, handsome, talented, and unfortunately, a narcissist to boot. When a veteran labels his award-winning piece as 'unoriginal,' Seishuu quickly loses his cool with severe repercussions. As punishment, and also in order to aid him in self-reflection, Seishuu's father exiles him to the Goto Islands, far from the comfortable Tokyo lifestyle the temperamental artist is used to. Now thrown into a rural setting, Seishuu must attempt to find new inspiration and develop his own unique art style—that is, if boisterous children (headed by the frisky Naru Kotoishi), fujoshi middle schoolers, and energetic old men stop barging into his house! The newest addition to the intimate and quirky Goto community only wants to get some work done, but the islands are far from the peaceful countryside he signed up for. Thanks to his wacky neighbors who are entirely incapable of minding their own business, the arrogant calligrapher learns so much more than he ever hoped to.",
    duration: 24,
    type: 'TV Series',
    studios: 'Kinema Citrus',
    date_aired: '2014-07-06T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/barakamon.jpg',
    total_episodes: 12,
    date_finished: '2014-09-14T08:05:06Z',
  },
  {
    title: 'No Game, No Life',
    description:
      "No Game No Life is a surreal comedy that follows Sora and Shiro, shut-in NEET siblings and the online gamer duo behind the legendary username 'Blank.' They view the real world as just another lousy game; however, a strange e-mail challenging them to a chess match changes everything—the brother and sister are plunged into an otherworldly realm where they meet Tet, the God of Games. The mysterious god welcomes Sora and Shiro to Disboard, a world where all forms of conflict—from petty squabbles to the fate of whole countries—are settled not through war, but by way of high-stake games. This system works thanks to a fundamental rule wherein each party must wager something they deem to be of equal value to the other party's wager. In this strange land where the very idea of humanity is reduced to child's play, the indifferent genius gamer duo of Sora and Shiro have finally found a real reason to keep playing games: to unite the sixteen races of Disboard, defeat Tet, and become the gods of this new, gaming-is-everything world.",
    duration: 24,
    type: 'TV Series',
    studios: 'Madhouse',
    date_aired: '2014-04-09T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/no-game-no-life.jpg',
    total_episodes: 12,
    date_finished: '2014-06-17T08:05:06Z',
  },
  {
    title: 'Made in Abyss',
    description:
      'The Abyss—a gaping chasm stretching down into the depths of the earth, filled with mysterious creatures and relics from a time long past. How did it come to be? What lies at the bottom? Countless brave individuals, known as Divers, have sought to solve these mysteries of the Abyss, fearlessly descending into its darkest realms. The best and bravest of the Divers, the White Whistles, are hailed as legends by those who remain on the surface. Riko, daughter of the missing White Whistle Lyza the Annihilator, aspires to become like her mother and explore the furthest reaches of the Abyss. However, just a novice Red Whistle herself, she is only permitted to roam its most upper layer. Even so, Riko has a chance encounter with a mysterious robot with the appearance of an ordinary young boy. She comes to name him Reg, and he has no recollection of the events preceding his discovery. Certain that the technology to create Reg must come from deep within the Abyss, the two decide to venture forth into the chasm to recover his memories and see the bottom of the great pit with their own eyes. However, they know not of the harsh reality that is the true existence of the Abyss.',
    duration: 24,
    type: 'TV Series',
    studios: 'Kinema Citrus',
    date_aired: '2017-07-07T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/made-in-abyss.jpg',
    total_episodes: 13,
    date_finished: '2017-09-24T08:05:06Z',
  },
  {
    title: 'Parasyte: The Maxim',
    description:
      'All of a sudden, they arrived: parasitic aliens that descended upon Earth and quickly infiltrated humanity by burrowing into the brains of vulnerable targets. These insatiable beings acquire full control of their host and are able to morph into a variety of forms in order to feed on unsuspecting prey. Sixteen-year-old high school student Shinichi Izumi falls victim to one of these parasites, but it fails to take over his brain, ending up in his right hand instead. Unable to relocate, the parasite, now named Migi, has no choice but to rely on Shinichi in order to stay alive. Thus, the pair is forced into an uneasy coexistence and must defend themselves from hostile parasites that hope to eradicate this new threat to their species.',
    duration: 24,
    type: 'TV Series',
    studios: 'Madhouse',
    date_aired: '2014-10-09T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/parasyte.jpg',
    total_episodes: 24,
    date_finished: '2014-03-27T08:05:06Z',
  },
  {
    title: 'Mob Psycho 100',
    description:
      "Eighth-grader Shigeo 'Mob' Kageyama has tapped into his inner wellspring of psychic prowess at a young age. But the power quickly proves to be a liability when he realizes the potential danger in his skills. Choosing to suppress his power, Mob's only present use for his ability is to impress his longtime crush, Tsubomi, who soon grows bored of the same tricks. In order to effectuate control on his skills, Mob enlists himself under the wing of Arataka Reigen, a con artist claiming to be a psychic, who exploits Mob's powers for pocket change. Now, exorcising evil spirits on command has become a part of Mob's daily, monotonous life. However, the psychic energy he exerts is barely the tip of the iceberg; if his vast potential and unrestrained emotions run berserk, a cataclysmic event that would render him completely unrecognizable will be triggered. The progression toward Mob's explosion is rising and attempting to stop it is futile.",
    duration: 24,
    type: 'TV Series',
    studios: 'Bones',
    date_aired: '2016-07-11T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/mob-psycho-100.jpg',
    total_episodes: 12,
    date_finished: '2016-09-27T08:05:06Z',
  },
  {
    title: 'Erased',
    description:
      "When tragedy is about to strike, Satoru Fujinuma finds himself sent back several minutes before the accident occurs. The detached, 29-year-old manga artist has taken advantage of this powerful yet mysterious phenomenon, which he calls 'Revival,' to save many lives. However, when he is wrongfully accused of murdering someone close to him, Satoru is sent back to the past once again, but this time to 1988, 18 years in the past. Soon, he realizes that the murder may be connected to the abduction and killing of one of his classmates, the solitary and mysterious Kayo Hinazuki, that took place when he was a child. This is his chance to make things right. Boku dake ga Inai Machi follows Satoru in his mission to uncover what truly transpired 18 years ago and prevent the death of his classmate while protecting those he cares about in the present.",
    duration: 24,
    type: 'TV Series',
    studios: 'A-1 Pictures',
    date_aired: '2016-07-11T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/erased.jpg',
    total_episodes: 12,
    date_finished: '2016-09-27T08:05:06Z',
  },
  {
    title: 'Yuri!!! On ICE',
    description:
      "Reeling from his crushing defeat at the Grand Prix Finale, Yuuri Katsuki, once Japan's most promising figure skater, returns to his family home to assess his options for the future. At age 23, Yuuri's window for success in skating is closing rapidly, and his love of pork cutlets and aptitude for gaining weight are not helping either. However, Yuuri finds himself in the spotlight when a video of him performing a routine previously executed by five-time world champion, Victor Nikiforov, suddenly goes viral. In fact, Victor himself abruptly appears at Yuuri's house and offers to be his mentor. As one of his biggest fans, Yuuri eagerly accepts, kicking off his journey to make it back onto the world stage. But the competition is fierce, as the rising star from Russia, Yuri Plisetsky, is relentlessly determined to defeat Yuuri and win back Victor's tutelage.",
    duration: 24,
    type: 'TV Series',
    studios: 'MAPPA',
    date_aired: '2016-10-06T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/yuri-on-ice.jpg',
    total_episodes: 12,
    date_finished: '2016-12-20T08:05:06Z',
  },
  {
    title: 'March comes in like a lion',
    description:
      "Having reached professional status in middle school, Rei Kiriyama is one of the few elite in the world of shogi. Due to this, he faces an enormous amount of pressure, both from the shogi community and his adoptive family. Seeking independence from his tense home life, he moves into an apartment in Tokyo. As a 17-year-old living on his own, Rei tends to take poor care of himself, and his reclusive personality ostracizes him from his peers in school and at the shogi hall. However, not long after his arrival in Tokyo, Rei meets Akari, Hinata, and Momo Kawamoto, a trio of sisters living with their grandfather who owns a traditional wagashi shop. Akari, the oldest of the three girls, is determined to combat Rei's loneliness and poorly sustained lifestyle with motherly hospitality. The Kawamoto sisters, coping with past tragedies, also share with Rei a unique familial bond that he has lacked for most of his life. As he struggles to maintain himself physically and mentally through his shogi career, Rei must learn how to interact with others and understand his own complex emotions",
    duration: 24,
    type: 'TV Series',
    studios: 'Shaft',
    date_aired: '2016-10-08T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/march-comes-in-like-a-lion.jpg',
    total_episodes: 12,
    date_finished: '2016-12-20T08:05:06Z',
  },
  {
    title: "The Ancient Magus' Bride",
    description:
      "Chise Hatori, a 15-year-old Japanese girl, was sold for five million pounds at an auction to a tall masked gentleman. Abandoned at a young age and ridiculed by her peers for her unconventional behavior, she was ready to give herself to any buyer if it meant having a place to go home to. In chains and on her way to an unknown fate, she hears whispers from robed men along her path, gossiping and complaining that such a buyer got his hands on a rare 'Sleigh Beggy.' Ignoring the murmurs, the mysterious man leads the girl to a study, where he reveals himself to be Elias Ainsworth—a magus. After a brief confrontation and a bit of teleportation magic, the two open their eyes to Elias' picturesque cottage in rural England. Greeted by fairies and surrounded by weird and wonderful beings upon her arrival, these events mark the beginning of Chise's story as the apprentice and supposed bride of the ancient magus.",
    duration: 24,
    type: 'TV Series',
    studios: 'WIT Studio',
    date_aired: '2017-10-08T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/the-ancient-magus-bride.jpg',
    total_episodes: 12,
    date_finished: '2017-12-20T08:05:06Z',
  },
  {
    title: 'Terror in Resonance',
    description:
      "Painted in red, the word 'VON' is all that is left behind after a terrorist attack on a nuclear facility in Japan. The government is shattered by their inability to act, and the police are left frantically searching for ways to crack down the perpetrators. The public are clueless—until, six months later, a strange video makes its way onto the internet. In it, two teenage boys who identify themselves only as 'Sphinx' directly challenge the police, threatening to cause destruction and mayhem across Tokyo. Unable to stop the mass panic quickly spreading through the city and desperate for any leads in their investigation, the police struggle to act effectively against these terrorists, with Detective Kenjirou Shibazaki caught in the middle of it all. Zankyou no Terror tells the story of Nine and Twelve, the two boys behind the masked figures of Sphinx. They should not exist, yet they stand strong in a world of deception and secrets while they make the city fall around them, all in the hopes of burying their own tragic truth.",
    duration: 22,
    type: 'TV Series',
    studios: 'MAPPA',
    date_aired: '2014-07-11T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/terror-in-resonance.jpg',
    total_episodes: 12,
    date_finished: '2014-09-24T08:05:06Z',
  },
  {
    title: 'Hyouka',
    description:
      "Energy-conservative high school student Houtarou Oreki ends up with more than he bargained for when he signs up for the Classics Club at his sister's behest—especially when he realizes how deep-rooted the club's history really is. Begrudgingly, Oreki is dragged into an investigation concerning the 45-year-old mystery that surrounds the club room. Accompanied by his fellow club members, the knowledgeable Satoshi Fukube, the stern but benign Mayaka Ibara, and the ever-curious Eru Chitanda, Oreki must combat deadlines and lack of information with resourcefulness and hidden talent, in order to not only find the truth buried beneath the dust of works created years before them, but of other small side cases as well. Based on the award-winning Koten-bu light novel series, and directed by Yasuhiro Takemoto of Suzumiya Haruhi no Shoushitsu, Hyouka shows that normal life can be full of small mysteries, be it family history, a student film, or even the withered flowers that make up a ghost story",
    duration: 24,
    type: 'TV Series',
    studios: 'Kyoto Animation',
    date_aired: '2012-04-23T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/hyouka.jpg',
    total_episodes: 22,
    date_finished: '2012-10-12T08:05:06Z',
  },
  {
    title: 'Yamada-Kun and the Seven Witches',
    description:
      "When Ryuu Yamada entered high school, he wanted to turn over a new leaf and lead a productive school life. That's why he chose to attend Suzaku High, where no one would know of his violent delinquent reputation. However, much to Ryuu's dismay, he is soon bored; now a second year, Ryuu has reverted to his old ways—lazy with abysmal grades and always getting into fights. One day, back from yet another office visit, Ryuu encounters Urara Shiraishi, a beautiful honors student. A misstep causes them both to tumble down the stairs, ending in an accidental kiss! The pair discover they can switch bodies with a kiss: an ability which will prove to be both convenient and troublesome. Learning of their new power, Toranosuke Miyamura, a student council officer and the single member of the Supernatural Studies Club, recruits them for the club. Soon joined by Miyabi Itou, an eccentric interested in all things supernatural, the group unearths the legend of the Seven Witches of Suzaku High, seven female students who have obtained different powers activated by a kiss. The Supernatural Studies Club embarks on its first quest: to find the identities of all the witches.",
    duration: 24,
    type: 'TV Series',
    studios: 'LIDENFILMS',
    date_aired: '2015-04-12T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/yamada-kun-and-the-seven-witches.jpg',
    total_episodes: 12,
    date_finished: '2015-06-26T08:05:06Z',
  },
  {
    title: 'Ping Pong the Animation',
    description:
      "'The hero comes. The hero comes. The hero comes. Chant these words in your mind, and I'll surely come to you...' This mantra is what Makoto Tsukimoto repeats as a source of motivation when he fights through the stress of not only grueling ping pong matches, but also in situations of his life. Makoto doesn't fight alone; he and his friend, Yutaka Hoshino, nicknamed Smile and Peco respectively, are two boys who have grown up playing ping pong together nearly every day. Peco, brimming with confidence, aims to be the best table tennis player in the world; Smile, on the other hand, shows little ambition. Nevertheless, the two have always stuck together, with a bond built upon their mutual love for this sport. Every year, students from all across Japan gather for the inter-high table tennis competition to achieve national and international stardom. Through intense training and competition, only the very best persevere. From the avant-garde director of Tatami Galaxy, Masaaki Yuasa, Ping Pong the Animation serves a tale of ambition with its fair share of bumps along the way. Whatever the odds, Peco and Smile will face them together.",
    duration: 24,
    type: 'TV Series',
    studios: 'Tatsunoko Production',
    date_aired: '2014-04-11T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/ping-pong-the-animation.jpg',
    total_episodes: 12,
    date_finished: '2014-06-26T08:05:06Z',
  },
  {
    title: 'Classroom of the Elite',
    description:
      'On the surface, Koudo Ikusei Senior High School is a utopia. The students enjoy an unparalleled amount of freedom, and it is ranked highly in Japan. However, the reality is less than ideal. Four classes, A through D, are ranked in order of merit, and only the top classes receive favorable treatment. Kiyotaka Ayanokouji is a student of Class D, where the school dumps its worst. There he meets the unsociable Suzune Horikita, who believes she was placed in Class D by mistake and desires to climb all the way to Class A, and the seemingly amicable class idol Kikyou Kushida, whose aim is to make as many friends as possible. While class membership is permanent, class rankings are not; students in lower ranked classes can rise in rankings if they score better than those in the top ones. Additionally, in Class D, there are no bars on what methods can be used to get ahead. In this cutthroat school, can they prevail against the odds and reach the top?',
    duration: 24,
    type: 'TV Series',
    studios: 'Lerche',
    date_aired: '2017-07-12T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/classroom-of-the-elite.jpg',
    total_episodes: 12,
    date_finished: '2017-09-26T08:05:06Z',
  },
  {
    title: 'Dusk Maiden of Amnesia',
    description:
      "Seikyou Private Academy, built on the intrigue of traditional occult myths, bears a dark past—for 60 years, it has been haunted by a ghost known as Yuuko, a young woman who mysteriously died in the basement of the old school building. With no memory of her life or death, Yuuko discreetly finds and heads the Paranormal Investigations Club in search of answers. A chance meeting leads Yuuko to cling to diligent freshman Teiichi Niiya, who can see the quirky ghost, they quickly grow close, and he decides to help her. Along with Kirie Kanoe, Yuuko's relative, and the oblivious second year Momoe Okonogi, they delve deep into the infamous Seven Mysteries of the storied school. Tasogare Otome x Amnesia tells a unique tale of students who work together to shed light on their school's paranormal happenings, all the while inching closer to the truth behind Yuuko's death.",
    duration: 24,
    type: 'TV Series',
    studios: 'Silver Link',
    date_aired: '2012-04-09T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/dusk-maiden-of-amnesia.jpg',
    total_episodes: 12,
    date_finished: '2012-06-17T08:05:06Z',
  },
  {
    title: 'Bakuman.',
    description:
      "With the serialization of their new manga, 'Detective Trap,' the writer-artist team, Akito Takagi and Moritaka Mashiro, better known by their pseudonym Muto Ashirogi, are one step closer to becoming world-renowned mangaka. For Mashiro, however, serialization is just the first step. Having promised to marry his childhood sweetheart and aspiring voice actress, Azuki Miho, once his manga gets an anime adaptation, Mashiro must continue his to popularize Ashirogi's work. A tremendously competitive cast of ambitious mangaka—including the wild genius, Eiji Niizuma; the elegant student, Yuriko Aoki, and her older admirer and partner, Takurou Nakai; the lazy prodigy, Kazuya Hiramaru; and the abrasive artist, Shinta Fukuda—both support and compete against Muto Ashirogi in creating the next big hit. As they adjust to their young and seemingly untested new editor, the dynamic duo struggle to maintain their current serialization, secure the top stop in Shounen Jack, and ultimately, achieve an anime adaptation of their manga. With new rivals and friends, Bakuman. 2nd Season continues Takagi and Mashiro's inspiring story of hard work and young love.",
    duration: 24,
    type: 'TV Series',
    studios: 'J.C.Staff',
    date_aired: '2011-10-01T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/bakuman.jpg',
    total_episodes: 25,
    date_finished: '2012-03-31T08:05:06Z',
  },
  {
    title: 'Little Witch Academia',
    description:
      "'A believing heart is your magic!'—these were the words that Atsuko 'Akko' Kagari's idol, the renowned witch Shiny Chariot, said to her during a magic performance years ago. Since then, Akko has lived by these words and aspired to be a witch just like Shiny Chariot, one that can make people smile. Hence, even her non-magical background does not stop her from enrolling in Luna Nova Magical Academy. However, when an excited Akko finally sets off to her new school, the trip there is anything but smooth. After her perilous journey, she befriends the shy Lotte Yansson and the sarcastic Sucy Manbavaran. To her utmost delight, she also discovers Chariot's wand, the Shiny Rod, which she takes as her own. Unfortunately, her time at Luna Nova will prove to more challenging than Akko could ever believe. She absolutely refuses to stay inferior to the rest of her peers, especially to her self-proclaimed rival, the beautiful and gifted Diana Cavendish, so she relies on her determination to compensate for her reckless behavior and ineptitude in magic. In a time when wizardry is on the decline, Little Witch Academia follows the magical escapades of Akko and her friends as they learn the true meaning of being a witch.",
    duration: 24,
    type: 'TV Series',
    studios: 'Trigger',
    date_aired: '2017-01-09T08:05:06Z',
    status: 'Finished Airing',
    img_url: './assets/little-witch-academia.jpg',
    total_episodes: 25,
    date_finished: '2017-06-30T08:05:06Z',
  },
];

const genres = [
  { name: 'Action' },
  { name: 'Adventure' },
  { name: 'Fantasy' },
  { name: 'Shounen' },
  { name: 'Horror' },
  { name: 'Drama' },
  { name: 'Comedy' },
  { name: 'Sci-Fi' },
  { name: 'Romance' },
  { name: 'Psychological' },
  { name: 'Thriller' },
  { name: 'Mystery' },
  { name: 'Slice of Life' },
  { name: 'Sports' },
  { name: 'Supernatural' },
  { name: 'Historical' },
  { name: 'Isekai' },
  { name: 'Super Power' },
  { name: 'Magic' },
  { name: 'School' },
];

const animeGenresMap = {
  'Jujutsu Kaisen': ['Horror', 'Shounen', 'Supernatural'],
  'Attack on Titan': ['Action', 'Drama', 'Mystery', 'Super Power'],
  'Demon Slayer: Kimetsu no Yaiba': ['Action', 'Historical', 'Supernatural', 'Shounen'],
  'One Piece': ['Action', 'Adventure', 'Comedy', 'Super Power', 'Shounen'],
  Naruto: ['Action', 'Adventure', 'Comedy', 'Super Power', 'Shounen'],
  'Death Note': ['Mystery', 'Thriller', 'Psychological', 'Supernatural'],
  'Fullmetal Alchemist': ['Action', 'Fantasy', 'Drama', 'Magic', 'Comedy'],
  'Tokyo Ghoul': ['Action', 'Horror', 'Psychological', 'Supernatural', 'Mystery'],
  'My Hero Academia': ['Action', 'Shounen', 'School', 'Super Power', 'Comedy'],
  'Hunter x Hunter': ['Action', 'Adventure', 'Shounen', 'Super Power', 'Fantasy'],
  'Steins;Gate': ['Drama', 'Sci-Fi', 'Psychological', 'Thriller', 'Isekai'],
  'Your Lie in April': ['Drama', 'Romance', 'School', 'Shounen'],
  Bleach: ['Action', 'Adventure', 'Comedy', 'Super Power', 'Supernatural'],
  'Dr. Stone': ['Adventure', 'Comedy', 'Sci-Fi', 'Shounen'],
  'Sword Art Online': ['Action', 'Fantasy', 'Romance', 'Isekai'],
  'Bungo Stray Dogs': ['Action', 'Comedy', 'Mystery', 'Super Power', 'Supernatural'],
  'Vinland Saga': ['Action', 'Adventure', 'Drama', 'Historical'],
  'One Punch Man': ['Action', 'Comedy', 'Sci-Fi', 'Super Power', 'Supernatural'],
  Gintama: ['Action', 'Comedy', 'Historical', 'Sci-Fi', 'Shounen'],
  'Devil May Cry': ['Action', 'Adventure', 'Mystery', 'Fantasy', 'Supernatural'],
  'Super Cube': ['Action', 'Adventure', 'Fantasy'],
  'The Beginning After the End': ['Action', 'Adventure', 'Fantasy'],
  Lazarus: ['Action', 'Sci-Fi'],
  'To Be Hero X': ['Action', 'Super Power'],
  'The Unaware Atelier Master': ['Action', 'Adventure', 'Fantasy'],
  'Food for the Soul': ['Slice of Life'],
  'Kowloon Generic Romance': ['Romance', 'Slice of Life', 'Mystery'],
  Teogonia: ['Action', 'Adventure', 'Fantasy'],
  'Your Forma': ['Mystery', 'Drama', 'Sci-Fi'],
  'Black Clover': ['Action', 'Comedy', 'Fantasy', 'Magic'],
  'Black Clover: Sword of the Wizard King': ['Action', 'Comedy', 'Fantasy', 'Magic'],
  'Sword Art Online: Progressive': ['Action', 'Fantasy', 'Romance', 'Isekai'],
  'The Seven Deadly Sins': ['Action', 'Adventure', 'Fantasy', 'Magic', 'Supernatural'],
  'The Seven Deadly Sins: Prisoners of the Sky': [
    'Action',
    'Adventure',
    'Fantasy',
    'Magic',
    'Supernatural',
  ],
  'Demon Slayer: Mugen Train': ['Action', 'Historical', 'Shounen', 'Supernatural'],
  'One Piece Film: Red': ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Shounen'],
  'Blue Box': ['Romance', 'School', 'Shounen', 'Sports'],
  'Amagami SS': ['Comedy', 'Romance', 'School', 'Slice of Life'],
  Citrus: ['Drama', 'Romance', 'School'],
  'Persona 5: The Animation': ['Action', 'Fantasy', 'Supernatural'],
  'Angel of Death': ['Adventure', 'Horror', 'Psychological', 'Thriller'],
  "Komi Can't Communicate": ['Comedy', 'Slice of Life'],
  'Spare Me, Great Lord!': ['Action', 'Adventure', 'Comedy', 'Fantasy'],
  'Spirit Chronicles': ['Action', 'Adventure', 'Drama', 'Fantasy', 'Romance', 'Isekai'],
  'Record of Ragnarok': ['Action', 'Drama', 'Super Power', 'Supernatural'],
  'Rascal Does Not Dream of Bunny Girl Senpai': [
    'Comedy',
    'Drama',
    'Romance',
    'School',
    'Supernatural',
  ],
  'Rascal Does Not Dream of a Dreaming Girl': [
    'Comedy',
    'Drama',
    'Romance',
    'School',
    'Supernatural',
  ],
  Another: ['Mystery', 'Horror', 'School', 'Supernatural', 'Thriller'],
  'Haikyu!!': ['Comedy', 'Drama', 'School', 'Sports', 'Shounen'],
  Barakamon: ['Comedy', 'Slice of Life'],
  'No Game, No Life': ['Adventure', 'Comedy', 'Fantasy', 'Supernatural', 'Isekai'],
  'Made in Abyss': ['Adventure', 'Mystery', 'Drama', 'Fantasy', 'Sci-Fi'],
  'Parasyte: The Maxim': ['Action', 'Drama', 'Horror', 'Sci-Fi', 'Psychological'],
  'Mob Psycho 100': ['Action', 'Comedy', 'Slice of Life', 'Supernatural'],
  Erased: ['Mystery', 'Supernatural', 'Psychological'],
  'Yuri!!! On ICE': ['Comedy', 'Sports'],
  'March comes in like a lion': ['Drama', 'Slice of Life'],
  "The Ancient Magus' Bride": ['Fantasy', 'Magic', 'Shounen', 'Slice of Life'],
  'Terror in Resonance': ['Mystery', 'Psychological', 'Thriller'],
  Hyouka: ['Mystery', 'School', 'Slice of Life'],
  'Yamada-Kun and the Seven Witches': [
    'Comedy',
    'Mystery',
    'Romance',
    'School',
    'Shounen',
    'Supernatural',
  ],
  'Ping Pong the Animation': ['Drama', 'Sports', 'Psychological'],
  'Classroom of the Elite': ['Drama', 'School', 'Slice of Life', 'Psychological'],
  'Dusk Maiden of Amnesia': ['Mystery', 'Horror', 'Romance', 'School', 'Shounen', 'Supernatural'],
  'Bakuman.': ['Comedy', 'Drama', 'Romance', 'Shounen'],
  'Little Witch Academia': ['Adventure', 'Comedy', 'Fantasy', 'Magic', 'School'],
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
    email: 'dexter@anitube.com',
    username: 'Dexter',
    password: 'password123',
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
    by: ['animeId'],
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

  console.log('Seed data inserted successfully');
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
