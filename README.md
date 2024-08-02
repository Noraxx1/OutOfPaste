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
> Out Of Paste started as a fork of [NoPaste](https://github.com/bokub/nopaste) but has been heavily edited.

____

# What is Out Of Paste?
Out Of Paste is a self-hosted alternative to traditional pastebin services. Unlike NoPaste, which encodes pastes in the URL using base64, Out Of Paste stores content directly server-side. It features a modern web interface, an easy-to-configure setup, and advanced settings for those seeking greater customization.

## Features
- Rate limiting to prevent users from creating too many files.
- Modern UI (the UI is mostly based on the NoPaste UI!).
- Configurable rate limits.
- Easy setup and deployment.
- Database support
> [!NOTE]  
> Features such as:
> - Encryption support,
> - Raw mode,
> - Fork and edit pastes,
> - Markdown support,
> - Mobile CSS fixes,
> - Themes,
>
> are coming soon!

# Hosting
> [!WARNING]  
> It is not recommended to use Out Of Paste in its current state as major improvements and features are forthcoming.
**Ensure you have [bun](https://bun.sh/) installed before proceeding**

To deploy, just run:
```bash
bun run deploy
```

##### You can check what these scripts do inside the [package.json](package.json)
# Configuring
Check out the [configuring wiki page](https://github.com/Noraxx1/OutOfPaste/wiki/Configuring)
