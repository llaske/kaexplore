# What is kaexplore ?

kaexplore is a command script to explore Khan Academy off line content.

	node kaexplore.js 
   
To see standard - english - content.

	node kaexplore.js francais
   
To see translated (here French) content. Find the exact language name to use in languagelookup.json.


# How it works ?

kaexplore use JSON description files from [https://learningequality.org/ka-lite/](https://learningequality.org/ka-lite/ "KA Lite") to generate contents and stats.

You can update JSON files from [https://github.com/learningequality/ka-lite](https://github.com/learningequality/ka-lite "KA Lite git repository"):

- topics are in ka-lite/kalite/topic_tools/data,
- language are in ka-lite/kalite/i18n/data,
- video size are in ka-lite/kalite/updates/data,
- video mapping are in ka-lite/kalite/i18n/data/



