```markdown
 ______     __  __     ______      ______     ______ 
/\  __ \   /\ \/\ \   /\__  _\    /\  __ \   /\  ___\
\ \ \/\ \  \ \ \_\ \  \/_/\ \/    \ \ \/\ \  \ \  __\
 \ \_____\  \ \_____\    \ \_\     \ \_____\  \ \_\  
  \/_____/   \/_____/     \/_/      \/_____/   \/_/  
                                                     
 ______   ______     ______     ______   ______      
/\  == \ /\  __ \   /\  ___\   /\__  _\ /\  ___\     
\ \  _-/ \ \  __ \  \ \___  \  \/_/\ \/ \ \  __\     
 \ \_\    \ \_\ \_\  \/\_____\    \ \_\  \ \_____\   
  \/_/     \/_/\/_/   \/_____/     \/_/   \/_____/
```

> [!NOTE]  
> Out Of Paste started out as a fork of [NoPaste](<https://github.com/bokub/nopaste>) but got heavily edited.

____

# What is Out Of Paste?
Out Of Paste is a self-hosted alternative to traditional pastebin services. Unlike NoPaste, which encodes pastes in the URL using base64, Out Of Paste stores content directly server-side. It features a modern web interface, an easy-to-configure setup, and advanced settings for those seeking greater customization.

## Features
- Rate limit to prevent users from creating too many files.
- Modern UI (the UI is mostly based on the NoPaste UI!)
- Rate limit configuration.
- Easy set-up and depoly.

> [!NOTE]  
> Features such as:
> - Database support(right now you can only save pastes in to text files),
> - Encryption supportx
> - Raw mode,
> - Fork and edit pastes,
> - Markdown,
> - Mobile css fix,
> - Themes,
> 
>  Are coming soon!

# Hosting
> [!WARNING]  
> It is not recommended to use Out Of Paste at this state since major improvements and features are coming.
> Also: ports below 1024 are considered privileged ports,to use those you will need privileged acces(or admin).
**Make sure to have (bun)[https://bun.sh/] installed before proceeding**

Just run:
```bun run deploy```
Or if you want to run with debug:

##### You can check what those script do inside of [package.json](package.json)
# Configuring

> [!NOTE]  
> those configuration go inside `config.json`.
> optional means that you can leave the variable empty but **doesn't mean you can delete it.**

### Required Configurations.
- `port`: this is the port of where nopaste should listen on,i reccomend using port `80` as it is the default port listened by dns.
- `metod`: **(NOTE:affects `DataDirectory`)** this is the metod on how the pastes should be saved,you can choose only file for now.
- `style`: this is the style of Nopaste right now the only current avaliable theme is `dracula`
- `debug`: this boolean defines if advanced loggin should be made in console.
- `MaximumRequests`: the maximum ammount of request you can send every `every`
- `Every`: the time span wich you can do `MaximumRequests`
- `fileCreationCacheMax`: I have no idea what this does ;-;.
- `fileCreationCacheMaxAge`: Read `fileCreationCacheMax`
- `MinChar`: the minimum size(in characters) that the paste should have to be allowed for save.

## Semi-optional configurations.
#### **(configurations affected by other configurations)**
- `DataDirectory`: **(NOTE:affected by `metod`)** if you are using the `file` save metod this is were the file creation should happen,specify paths like: `path/to/folder` and make sure the folder exists in the same directory as Out Of Paste
### Optional configurations.
- `HosterName`: this is the name of the people who is hosting Out Of Paste,so instead of renaming the whole Out Of Paste to another name you can just easily credit yourself or your website.
- `RateLimitMessage`: this is the message that gets printed in the **client console** after the user gets ratelimited.
