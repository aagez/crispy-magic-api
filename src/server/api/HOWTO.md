# Utilisation de l'API REST

Toutes les URL de l'api commencent par `/api`

# Obtenir des cartes

On peut obtenir un ensemble de cartes répondant à certaines conditions avec la route `/api/cards`. Les conditions sont passées en paramètres via l'URL.
Si plusieurs conditions sont passées, seules les cartes remplissant TOUTES les conditions sont renvoyées

Voici la liste des paramètres possibles

* `name` : recherche les cartes par nom. Ce paramètre est traité comme une expression régulière. De plus, il est insensible à la casse.
/!\ : Pour l'instant, seul les noms anglais sont recherchés
* `cmc` : recherche les cartes ayant le cout converti de mana demandé. Si le paramètre n'est pas un nombre entier, alors il est ignoré.
* `types` : recherche les cartes ayant au moins un des types passés en paramètre. La recherche ne s'effectue pas sur les sous-types (human, gobelin, ...) ou les super-types (legendary, basic). Pour passer un type en paramètre, une seule lettre suffit par type et elle peut être aussi bien en majuscule qu'en minuscule :
  - C : Créature
  - A : Artéfact
  - E : Enchantement
  - I : Éphémère (Instant)
  - S : Rituel (Sorcery)
  - P : Planeswalker
  - L : Terrain (Land)
  - N : Plan (Plane) (le P est déjà pris par Planeswalker)
  - O : Phénomène (Phenomenon) (même problème que pour le plan)


Exemple : `GET /api/cards?name=gideon&cmc=4&types=c` nous renverra toutes les cartes de créature qui ont gideon dans leur nom (insensible à la casse) et dont le cout converti de mana est de exactement 4

D'autres conditions arriveront, ainsi que la recherche par nom français.


# Format des données renvoyées

Le serveur retourne une réponse au format `JSON`, un tableau des sets dans lesquels au moins un résultat a été trouvé.

## Format des objets de set

Chaque objet de set contient :

* `name` : le nom du set
* `code` : le code officiel du set dans le Gatherer
* `type` : le type du set (edition de base, expansion, ...)
* `translations` : la liste des noms du sets dans les langues dans lesquelles il a été traduit. C'est un objet dont chaque item a pour clé le code de la langue (en 2 lettres) et le nom du set dans ladite langue
* `cards` : le tableau contenant les cartes du set répondant aux conditions

## Format des objets de carte

Les cartes sont contenues dans le tableau `cards` de chaque set. Chaque objet de carte contient : 

* `multiverseId` : l'identifiant unique ce cette version de la carte
* `number` : le numéro de la carte dans ce set
* `layout` : le format de la carte. Ne peut prendre que ces valeurs : normal, split, flip, double-faced, token, plane, scheme, phenomenon, leveler, vanguard, meld.
* `name` : le nom anglais de la carte. Dans le cas de cartes double-face, séparées (split) ou à retourner (flip), un seul des noms est donné. L'autre nom a son propre enregistrement dans la base. Des exemples sont donnés plus bas
* `names` : les différents noms de la carte. N'est utile que dans les cas cités précedemment.
* `cmc` : Un entier représentant le cout converti en mana de la carte (absent pour les terrains)
* `manaCost` : Le cout de mana en détail. Dans l'exemple ci-dessous, {X}{2}{R}{R} signifie 2 manas rouges, 2 manas génériques et X manas
* `colors` : Les couleurs de la carte (dans un tableau de Strings)
* `colorIdentity` : L'identité de couleur de la carte. Principalement utilisé pour le format commander
* `type` : Le type complet de la carte, avec super-types et sous-types. Par exemple : "Legendary Creature - Angel"
* `supertypes` : le ou les supertypes de la carte. Dans l'exemple précédent, cela donnerait ["Legendary"]
* `types` : le ou les types de la carte. Toujours dans le même exemple, on aurait ["Creature"]
* `subtypes` : le ou les sous-types de la créature. On aurait ici ["Angel"]. C'est également ici que l'on retrouve le nom des Planeswalkers
* `rarity` : la rareté de la carte. Ne peut prendre que ces valeurs : Common, Uncommon, Rare, Mythic Rare, Special, Basic Land.
* `text` : le texte de la carte
* `flavor` : le texte d'ambiance de la carte (texte en italique en bas de la carte)
* `artist` : le nom de l'illustrateur
* `printings` : la liste des sets dans lesquels la carte a été imprimée
* `releaseDate` : la date de sortie
* `legalities` : la légalité de la carte dans les différents formats

Ces données sont présentes pour toutes les cartes. Mais il y a aussi certaines données qui ne sont présentes que dans certains cas particuliers

* Si la carte possède plusieurs variantes, alors le champ `variations` contient un tableau avec tous les `multiverseId` des variantes.
* Si la carte est une créature, alors les champs `power` et `thougness` indiquent respectivement la force et l'endurance de la créature. CES CHAMPS SONT DES CHAÎNES DE CARACTÈRES, ET PAS DES ENTIERS, ceci à cause du fait que certaines créatures peuvent être "*/*", ou "1+*/1+*"
* Dans le cas d'un planeswalker, le champ `loyalty` contient sa loyauté, sous forme d'entier
* Certaines cartes contiennent un champ `rulings`. C'est une liste de précisions ou de modifications des règles de la carte, publiés par Wizards of the Coast


Voici un exemple de résultat avec une seule carte

```json
[{
  "name": "Tenth Edition",
  "code": "10E",
  "type": "core",
  "translations": {
    "de": "Zehnte Edition",
    "fr": "Dixième édition",
    "it": "Decima Edizione",
    "es": "Décima Edición",
    "pt": "Décima Edição",
    "jp": "第10版",
    "cn": "第十版",
    "ru": "Десятое Издание",
    "tw": "Tenth Edition"
  },
  "cards": [{
    "artist": "Chippy",
    "cmc": 4,
    "colorIdentity": ["R"],
    "colors": ["Red"],
    "flavor": "\"Like an avalanche. With teeth. That will chase you. Uphill.\"\n—Flint Foot, viashino runner",
    "foreignNames": [{
      "language": "Chinese Simplified",
      "name": "液石滑动",
      "multiverseid": 147741
    }, {
      "language": "Chinese Traditional",
      "name": "液石滑動",
      "multiverseid": 151431
    }, {
      "language": "French",
      "name": "Coulée de fluipierre",
      "multiverseid": 150136
    }, {
      "language": "German",
      "name": "Schmelzsteinrutsch",
      "multiverseid": 148507
    }, {
      "language": "Italian",
      "name": "Valanga di Mutaroccia",
      "multiverseid": 148890
    }, {
      "language": "Japanese",
      "name": "流動石の山崩れ",
      "multiverseid": 148124
    }, {
      "language": "Portuguese (Brazil)",
      "name": "Deslize de Rochafluente",
      "multiverseid": 149753
    }, {
      "language": "Russian",
      "name": "Каменный Оползень",
      "multiverseid": 149370
    }, {
      "language": "Spanish",
      "name": "Alud de piedra variable",
      "multiverseid": 150519
    }],
    "id": "f4b09feb4a51a7e46bad98dc3fac9d5fc8a340ed",
    "imageName": "flowstone slide",
    "layout": "normal",
    "legalities": [{
      "format": "Commander",
      "legality": "Legal"
    }, {
      "format": "Legacy",
      "legality": "Legal"
    }, {
      "format": "Masques Block",
      "legality": "Legal"
    }, {
      "format": "Modern",
      "legality": "Legal"
    }, {
      "format": "Vintage",
      "legality": "Legal"
    }],
    "manaCost": "{X}{2}{R}{R}",
    "mciNumber": "203",
    "multiverseid": 130542,
    "name": "Flowstone Slide",
    "number": "203",
    "originalText": "All creatures get +X/-X until end of turn.",
    "originalType": "Sorcery",
    "printings": ["NMS", "9ED", "10E"],
    "rarity": "Rare",
    "text": "All creatures get +X/-X until end of turn.",
    "type": "Sorcery",
    "types": ["Sorcery"]
  }]
}]
```


### Exemples de cartes spéciales

Voici des exemples des différents formats de cartes :

* Double-faced : [Garruk Relentless / Garruk, the Veil-Cursed](http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=245251)
* Split :  [Odds / Ends](http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=107445)
* Flip : [Akki Lavarunner / Tok Tok, volcano Born](http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=78694)
* Plane : [Murasa](http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=423634)
* Scheme : [All in good time](http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=212648)
* Phenomenon : [Interplanar Tunnel](http://gatherer.wizards.com/Pages/Card/Details.aspx?name=Interplanar+Tunnel)
* Leveler : [Joraga Treespeaker](http://gatherer.wizards.com/pages/card/Details.aspx?multiverseid=193462)
* Meld : [Chittering Host](http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=414392)