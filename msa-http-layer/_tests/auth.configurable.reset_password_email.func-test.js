require('../../tests_globals.js').init();

initCookie(admin);

[
    {
        email      : random_email(),
        password   : random_password(),
        password2  : random_password(),
        plugin_name: random_title()
    }
].map(function(test_data) {

        it("should add plugin with reset password email template", function(done) {
            api_post('/api/plugins/save',
                [
                    {
                        _type: "Plugin",
                        title: test_data.plugin_name,
                        resetPasswordEmail: {
                            subject: "jajaja",
                            html: '<html>bububu {{bububu}}</html>'
                        }
                    }
                ],
                function(err, res) {
                    assert.ifError(err);

                    assert(res);
                    assert.equal(res.statusCode, 200);
                    assert(res.body);
                    assert(res.body[0] === null);

                    assert(GeneratedPlugin = res.body[1]);
                    assert(res.body[1]._id);
                    assert(res.body[1]._order);

                    done();
                }
            )
        });

        it("should get mail options suited to plugin on request to reset password", function(done) {
            api_post('/api/auth/request_reset_password', [{_id: user.email}], function(err, res) {
                assert.ifError(err);

                assert.equal(res.statusCode, 200);

                assert(res);
                assert(res.body);

                assert(res.body[0] == null);
                assert(res.body[1].mailOptions);

                assert(res.body[1].mailOptions.html);
                assert.equal(res.body[1].mailOptions.html.match(/jajaja/));

                assert(res.body[1].mailOptions.subject);
                assert.equal(res.body[1].mailOptions.subject.match(/bububu/));

                done();
            });

        });
    }
);

