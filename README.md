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
Check out: [configuring wiki page](https://github.com/Noraxx1/OutOfPaste/wiki/Configuring)

