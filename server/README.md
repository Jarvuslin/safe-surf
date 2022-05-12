# SafeSurf

SafeSurf is a webapp that aims to give users access to our proprietary and autonomous profanity identification tool. Users will be able to input webpage links and in return receive profanity reports. The processing will take place on our local host, where deep search algorithms will identify and evaluate profanity levels across web pages. Once ready, users will be given ample amounts of information - including a percentage based analysis of a site's profanity levels and if requested, a preview of the page.

By setting preventative measures in place, SafeSurf can prove useful to organizations across the world. The need for a rapid and reusable tool like SafeSurf is now needed more than ever. With over 40 trillion gigabytes of data encompassing the internet, identifying inappropriate data has become a challenge. SafeSurf aims to give users access to information that would otherwise not be accessible, allowing users to make informed decisions.

Ultimately, SafeSurf can only excel if users find value in the service. To increase SafeSurfs odds of becoming successful, we believe that a 90% accuracy rate must be met before launch. This will decrease the odds of profanity slipping through our algorithms - helping to create a better user experience by substantially lowering systematic error.

## Installation

#### Dependencies

- [Node.js](https://nodejs.org/en/)
- [Puppeteer](https://github.com/puppeteer/puppeteer)

#### Web Browser

Manual intervention is required for the executable path. Replace your `$BROWSER` with the executable that is suited for your operating system. Below is an example for a user that uses Google Chrome.

If the web browser is on a Windows machine, use the following executable path:

```javascript
executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
```

If the web browser is on a Linux machine, use the following executable path:

```javascript
executablePath: '/usr/bin/google-chrome-stable'
```

## License

SafeSurf is libre software and is released under GPLv3.
