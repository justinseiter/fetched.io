#Fetched.io
[Fetched.io](http://fetched.io) is a web app built to store screenshots as well as the metadata captured by the command line tool [screenFetch](https://github.com/KittyKatt/screenFetch). The final product is a web app that allows users to browse screenshots by distro, desktop environment, or any other screenFetch data point.

![Fetched.io upload in action.](http://res.cloudinary.com/dujajeeu7/image/upload/v1439360764/fetchedio_r6zutx.gif)

Once a Fetched.io account is created the user adds their newly issued Fetched.io ID to their list of local environment variables.

    export FETCHED_ID=123456789

Shots can be taken and uploaded by passing screenFetch the "-s" (screenshot) and "-u" (upload) flags. The final "fetch" flag tells screenFetch where to push the shot. **Note: "fetch" has not been officially merged into the main screenFetch app. Please see the "Getting Started" section below for details**

    $ screenfetch -s -u fetch
    Taking shot in 3.. 2.. 1..

After the shot is successfully uploaded Fetched.io will send screenFetch a direct link to the shot.

    ==>  Your screenshot can be viewed at http://fetched.io/shots/abcd

## Getting Started
**The "fetch" option has not been officially merged into the main screenFetch app yet.**  However, you can use the following steps to start submitting shots to Fetched.io.

 1. Signup at http://fetched.io/register and get your **FETCHED_ID**.
 2. Add your FETCHED_ID to your existing list of local environment variables. You can store it in your ```.profile``` or wherever you prefer to keep these variable. The result we're after is getting back your FETCHED_ID when we echo the variable, eg ```echo $FETCHED_ID```.
 3. Install [screenFetch](https://github.com/KittyKatt/screenFetch) or go to the next step if you already have it.
 4.  Add [the following snippet](https://gist.github.com/justinseiter/cd624a4948596a72cd32) to the "takeShot" section of your local screenFetch. Add it is just before the "local-example". You can find where screenFetch is located on your system with ```which screenfetch```. [This is what your copy of screenFetch should look like when you're done.](https://github.com/justinseiter/screenFetch/blob/master/screenfetch-dev#L2096)
 5. You're all set! Now just issue the command ```screenfetch -s -u fetch```.

## Troubleshooting

**ISSUE: No link is returned**, ie - ```your screenshot can be viewed at```

**SOLUTION:** This probably means you haven't updated your local copy of screenFetch with the "fetch" snippet. See "Step 4" above. It's also possible you mistyped the command. It should be ```screenfetch -s -u fetch```

**ISSUE: Link takes you directly to http://fetched.io/shots/**

**SOLUTION:** If your link does not include an ID for the shot in the path, ie - ```shots/1a2b3c...``` it probably means it cannot find the FETCHED_ID local variable. Check that the variable is available by typing ```echo $FETCHED_ID``` in your terminal. If a blank line is returned see "Step 2" above. Note, if you added the environment variable to your ```.profile``` you'll need to logout/login or issue the command ```source ~/.profile``` to reload the variables in the file.

**ISSUE: Uploads stopped working and no link is produced.**

**SOLUTION:** This could be due to your local copy of screenFetch getting overwritten by your package manager. See "Step 4" above to add the "fetch" snippet back. I know, this sucks. However, if/when "fetch" is merged into the official screenFetch app everything will be dandy. :)