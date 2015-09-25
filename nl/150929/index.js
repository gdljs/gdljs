'use strict';

class Builder{

  constructor (){
    this.starsByDate = {};

    this.starsData = JSON.parse(document.querySelector('#data').textContent).items.reverse();

    this.wall = document.querySelector('.wall');

    this.postGroupTemplate = document.querySelector('#post-group-template').content;
    this.postTemplate = document.querySelector('#post-template').content;
  }

  process (){

    this._getStarsByDate();
    this._processPosts();

    console.log('>', this.starsByDate);

  }

  _getStarsByDate () {

    this.starsData.forEach( (star) => {

      if(!star.message){
        return;
      }

      let date = new Date(parseInt(star.message.ts.substr(0,star.message.ts.indexOf('.')))* 1000),
          month = ["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"][date.getMonth()],
          day = date.getDate(),
          dateIndex = month+'-'+day;

      if(this.starsByDate[dateIndex]){
        this.starsByDate[dateIndex].push(star);
      }else{
        this.starsByDate[dateIndex] = [star];
      }

    });

  }

  _processPosts () {

    Object.keys(this.starsByDate).forEach( (date) => {
      var month = date.split('-')[0],
          day = date.split('-')[1];

      this.postGroupTemplate.querySelector('.posts').innerHTML = '';
      this.postGroupTemplate.querySelector('.month').innerHTML = month;
      this.postGroupTemplate.querySelector('.day').innerHTML = day;

      this.starsByDate[date].forEach((star)=>{
        let date = new Date(parseInt(star.message.ts.substr(0,star.message.ts.indexOf('.')))* 1000),
            hours = date.getHours(),
            time = hours + ':' + date.getMinutes() + (hours >= 12 ? ' PM' : ' AM');

        this.postTemplate.querySelector('.links').innerHTML = '';

        this.postTemplate.querySelector('.month').innerHTML = month;
        this.postTemplate.querySelector('.day').innerHTML = day;
        this.postTemplate.querySelector('.time').innerHTML = time;

        this.postTemplate.querySelector('.username').innerHTML = star.message.user;
        this.postTemplate.querySelector('.message').innerHTML = star.message.text;

        if(star.message.attachments){
          star.message.attachments.forEach((attachment) => {
            let anchor = document.createElement('a');
            anchor.href = attachment.from_url;
            anchor.title = attachment.title;
            anchor.appendChild(document.createTextNode(attachment.title));
            this.postTemplate.querySelector('.links').appendChild(anchor);
          });
        }

        this.postGroupTemplate.querySelector('.posts').appendChild(document.importNode(this.postTemplate, true));
      });

      this.wall.appendChild(document.importNode(this.postGroupTemplate, true));
    });


  }

};

