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