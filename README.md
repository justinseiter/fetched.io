#Fetched.io
[Fetched.io](http://fetched.io) is a [screenFetch](https://github.com/KittyKatt/screenFetch) utility built to store screenshots as well as the metadata captured by screenFetch.

![Fetched.io upload in action.](http://res.cloudinary.com/dujajeeu7/image/upload/v1439360764/fetchedio_r6zutx.gif)

Once a Fetched.io account is created the user adds their newly issued Fetched.io ID to their list of local environment variables.

    export FETCHED_ID=123456789

Shots can be taken and uploaded by passing screenFetch the "-s" (screenshot) and "-u" (upload) flags. The final "fetch" flag tells screenFetch where to push the shot.

    $ screenfetch -s -u fetch
    Taking shot in 3.. 2.. 1..

After the shot is successfully uploaded Fetched.io will send screenFetch a direct link to the shot.

    ==>  Your screenshot can be viewed at http://fetched.io/shots/abcd

## Getting Started
**The "fetch" option has not been officially merged into the main screenFetch app yet.** 

In the meantime you can use the following steps to start submitting shots to Fetched.io.

 1. Signup at http://fetched.io/register to create an account and receive your **FETCHED_ID**.
 2. Add your FETCHED_ID to your existing list of local environment variables. Usually these are stored in a file located at ```/home/username/.profile```. If you prefer to store it in ```.bashrc``` or ```.zshrc``` that is fine too. The result we're after is getting back a FETCHED_ID when we echo the variable, eg ```echo $FETCHED_ID``` should return the ID from the source file.
 3. Install the latest version of [screenFetch](https://github.com/KittyKatt/screenFetch). Their is an option for just about every type of distro.
 4.  Add the following snippet to the "takeShot" section of your local screenFetch. A good place to add it is just before the "local-example". You can find where screenFetch is located on your system with ```which screenfetch```.
    'fetch')
      baseurl='http://fetched.io/shots'
      uploadurl='http://fetched.io/shots'
      ret=$(curl -sf -F file="@${shotfiles[@]}" -F fetchedKey="$FETCHED_ID" -F os="$distro" -F osVer="$distro_release" -F osCodeName="$distro_codename" -F kernel="$kernel" -F uptime="$uptime" -F packages="$pkgs" -F shell="$shell_type" -F resolution="$xResolution" -F de="$DE" -F wm="$WM" -F wmTheme="$Win_theme" -F gtk2Theme="$gtk2Theme" -F gtk3Theme="$gtk3Theme" -F iconTheme="$gtkIcons" -F font="$gtkFont" -F cpu="$cpu" -F gpu="$gpu" -F ram="$mem" ${uploadurl})
      filehash="${ret##*id\":\"}"
      filehash="${filehash%%\"*}"
      desturl="${baseurl}/${filehash}"
    ;;
 5. You're all set! Now just issue the command ```screenfetch -s -u fetch```.