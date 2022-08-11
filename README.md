# ameliaOverlayDemo

Many clients want to see Amelia displayed on their own website. In a demo environment only, we can use some clever Javascript and a Chrome extension to accomplish exactly this ask. Please note that without the Chrome Extension below, the customer's website will not load.

### Chrome Extension

First, get this Chrome extension - https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe?hl=en-US

This will overcome X-Frame security built into Chrome (and all other modern browsers).

### Git Repo

Next, clone this git repo - https://github.com/dsteele101/ameliaOverlayDemo

The repo will contain several files:

index.html (Edit actions)
script.js (This can be left alone)
style.css (Only change if you would like to adjust the size/look/feel of the chat window)
properties.json

Example properties.json:
```{
  "originUrl": "https://vertiv.demo.amelia.com/",
  "ameliaUrl": "https://vertiv.demo.amelia.com/Amelia/ui/vertiv/?domainCode=vertiv",
  "chatUrl": "https://vertiv.demo.amelia.com/Amelia/ui/vertiv/",
  "parentUrl": "https://www.vertiv.com",
  "actions": {
    "nav_pst5": {
      "url": "https://www.vertiv.com/en-us/products-catalog/critical-power/uninterruptible-power-supplies-ups/liebert-pst5-ups/"
    },
    "nav_gxt5": {
      "url": "https://www.vertiv.com/en-us/products-catalog/critical-power/uninterruptible-power-supplies-ups/vertiv-liebert-gxt5-ups-500-3000va-120v-ups"
    },
    "nav_where_to_buy": {
      "url": "https://partners.vertiv.com/English/directory?AccountCountry=USA&iAmAValue=Installer%20%2F%20Contractor&iAmLooking=Find%20a%20Vertiv%20Partner&stateValue=Georgia"
    },
    "nav_lithium": {
      "url": "https://www.vertiv.com/en-us/products-catalog/critical-power/uninterruptible-power-supplies-ups/vertiv-liebert-psi5-lithium-ion-ups/"
    },
    "nav_exl": {
      "url": "https://www.vertiv.com/en-us/products-catalog/critical-power/uninterruptible-power-supplies-ups/liebert-exl-s1/"
    },
    "nav_trienergy": {
      "url": "https://www.vertiv.com/en-us/products-catalog/critical-power/uninterruptible-power-supplies-ups/liebert-trinergy-cube-ups/"
    }
  }
}
```

Replace the values above with ones that make sense for your demo/environment. The parentUrl can be literally any URL you can access. The actions are a list of places to which you want Amelia to navigate. You will use these values inside of your BPN/DEB flow.

### DEB/BPN

To send a message to allow navigation, this message needs to come from the DEB/BPN. Below is an example script:
```import groovy.json.JsonOutput
 
def jsonString = '''{
    "action": "sendChatOverlayEvent",
    "payload": {
        "componentType": "MessageIntegration",
        "subComponentType": "ChatOverlay",
        "formMessageType": "chatOverlay",
        "destinationUrl": "https://dsteele101.github.io/ameliaOverlayDemo/",
        "data": {
            "action": "nav_pst5",
            "additionalData": "pst5"
             
        }
    }
}'''
 
jsonString = JsonOutput.toJson(jsonString)
execution.setVariable("jsonString", jsonString)
```

This will send a message back to the parent page where a JS listener will await an action. In the above example, nav_pst5.

For BPNs, create a task for with "send the integration message jsonString"

For DEB flows, use the following in your script:
```import groovy.json.JsonOutput

jsonString = JsonOutput.toJson(jsonString)
messageService.sendIntegrationMessage(jsonString)
```

### JS

Navigation actions are dynamically accepted values from properties.json. No changes to the JS files need to be made.

### Github Pages

To make life easy, this can be hosted out of Github Pages. Github accounts are free, as is hosting. Follow the steps on the Github Pages website to get a Github page started. Be sure to remove any Jekyll theme references that Github auto generates. Please note that any changes in Github can take a few minutes to be reflected on the website.

### Chrome

If you have trouble with your browser caching data from old sessions (ex: The domain and/or instance will not change), clear out the cookies for that website and reload.
