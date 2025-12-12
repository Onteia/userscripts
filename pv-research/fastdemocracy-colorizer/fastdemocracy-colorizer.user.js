// ==UserScript==
// @name        Color fastdemocracy bill sponsors based on party
// @namespace   Violentmonkey Scripts
// @match       https://fastdemocracy.com/*
// @grant       none
// @version     1.0.1
// @author      onteia
// @description Adds a colored background element based on legislator's party
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @updateURL   https://github.com/Onteia/userscripts/raw/refs/heads/main/pv-research/fastdemocracy-colorizer/fastdemocracy-colorizer.user.js
// @downloadURL https://github.com/Onteia/userscripts/raw/refs/heads/main/pv-research/fastdemocracy-colorizer/fastdemocracy-colorizer.user.js
// @supportURL  https://github.com/Onteia/userscripts/issues
// ==/UserScript==


const PartyToColorMap = {
  Democratic: "rgba(0,0,255,0.15)",
  Republican: "rgba(255,0,0,0.15)"
}

function getParty(htmlData) {
  const partyLine = $(htmlData).find(".billpage-number").children().eq(1).get(0).innerHTML;
  let party = undefined;

  if(partyLine.includes("Democratic")) party = "Democratic";
  else if(partyLine.includes("Republican")) party = "Republican";

  return party;
}

function setColor(sponsor, url) {
  $.ajax({
      url,
      dataType: 'html',
      async: true,
      success: function(data) {
        const party = getParty(data);

        if(party === undefined) return;

        $(sponsor).parent().get(0).style = `background-color: ${PartyToColorMap[party]};border-radius: 8px;padding:4px;`;
      }
    });
}

function colorBasedOnParty() {
  const sponsors = ($(".billcard-sponsor-name").length) ? $(".billcard-sponsor-name") : $(".sponsor-name-bill");

  for(const sponsor of sponsors) {
    const sponsorUrl = $(sponsor).parent().get(0).href ?? $(sponsor).children().eq(0).get(0)?.href;
    if(sponsorUrl === undefined) continue;

    setColor(sponsor, sponsorUrl);
  }
}

function main() {
  const page = $('#content');
  const config = { attributes: true, childList: true, subtree: true };
  const callback = function (mutationList, observer) {
    for(const mutation of mutationList) {
      if(mutation.type === 'childList') {
        colorBasedOnParty();
      }
    }
  }

  const observer = new MutationObserver(callback);
  observer.observe(page.get(0), config);
}

$(document).ready(main);
