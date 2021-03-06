/*jshint esversion: 6 */
var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var {app} = require('../../server/server');
var {db, User, Room, Note} = require('../../server/database/db-config');

var testUser1 = {
  id: 9999,
  facebookId: 12345,
  name: 'Testing McTesty',
  email: 'test@email.com',
  pictureUrl: 'https://www.test.com/picture.jpg',
  gender: 'Male'
};

var testUser2 = {
  id: 6666,
  facebookId: 67890,
  name: 'Speccy McSpec',
  email: 'spec@email.com',
  pictureUrl: 'https://www.spec.com/picture.jpg',
  gender: 'Female'
};

before((done) => {
  const options = process.env.NODE_ENV === 'test' ? { force: true } : {};
  db.sync(options)
  .then(() => {
    User.destroy({where: { id: 9999 } })
    .then(() => User.destroy({where: { id: 6666 } }))
    .then(() => Room.destroy({ where: { hostId: 9999 } }))
    .then(() => User.create(testUser1))
    .then(() => User.create(testUser2))
    .then(() => done());
  });
});

describe('/api/rooms/', () => {

  var hash1, hash2;
  var testRoom = {
    topic: 'Data Structures',
    className: 'Hack Reactor',
    lecturer: 'FredZ',
    hostId: 9999
  };

  beforeEach((done) => {
    request(app)
    .post('/api/rooms')
    .send(testRoom)
    .expect((res) => hash2 = res.body.pathUrl)
    .end(done);
  });

  afterEach(() => Room.destroy({ where: { hostId: 9999 } }));

  describe('Room Creation /api/rooms', () => {

    it('should create a entry in the database', () => {
      Room.findOne({ where: { hostId: 9999 } })
      .then((room) => expect(room).to.exist);
    });

    it('should pass back a pathUrl', (done) => {
      request(app)
      .post('/api/rooms')
      .send(testRoom)
      .expect((res) => {
        hash1 = res.body.pathUrl;
        expect(res.body.pathUrl.length).to.equal(5);
      })
      .end(done);
    });
    it('should create a unique hash', () => {
      expect(hash1).to.exist;
      expect(hash2).to.exist;
      expect(hash1).to.not.equal(hash2);
    });
  });

  // describe('Room Joining /api/rooms/:pathUrl', () => {
  //   describe('POST', () => {
  //     it('should have user join the room', () => {});
  //     it('', () => {});
  //   });
  // });
  //
  // describe('Room Status /api/room/status', () => {
  //   it('', () => {});
  // });

});

// xdescribe('/api/users', () => {
//   beforeEach(() => {});
//   afterEach(() => {});
//
//   describe('All Users in Rooms /api/users/rooms/:userId', () => {
//     describe('GET', () => {
//       it('should return all users and rooms', () => {});
//     });
//   });
//
// });
//
// xdescribe('/api/notes', () => {
//   beforeEach(() => {});
//   afterEach(() => {});
//
//   describe('Note Creation', () => {
//     describe('/api/notes/create', () => {
//       it('', () => {});
//       it('', () => {});
//     });
//   });
//   describe('Note Editing', () => {
//     describe('/api/notes/:userId/:roomId', () => {
//       it('', () => {});
//       it('', () => {});
//     });
//   });
// });
//
// xdescribe('/api/audio', () => {
//   beforeEach(() => {});
//   afterEach(() => {});
//
//   describe('Audio Retrieval', () => {
//     describe('GET /api/audio/:pathUrl', () => {
//       it('', () => {});
//     });
//   });
//
// });
