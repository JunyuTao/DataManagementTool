const downloadDSoftwareData = document.querySelector('#downloadSoftware')


downloadDSoftwareData.addEventListener('click', (e) => {
    e.preventDefault()

    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection('guides').onSnapshot(snapshot => {
                let guide = []
                snapshot.forEach(doc => {
                    guide.push({
                        id: doc.id,
                        Software: doc.data().software,
                        Frist_Name: doc.data().fname,
                        Last_Name: doc.data().lname,
                        License_key: doc.data().license_key,
                        Version: doc.data().version,
                        Tag_Number: doc.data().tag_num,
                        APR: doc.data().apr,
                        Expiration_Date: doc.data().exp_date,
                        Comment: doc.data().comment,
                    })

                });

                //Convert JSON Array to string.
                let json = JSON.stringify(guide);

                //Convert JSON string to BLOB.
                json = [json];
                let blob1 = new Blob(json, { type: "text/plain;charset=utf-8" });

                //Check the Browser.
                const isIE = false || !!document.documentMode;
                if (isIE) {
                    window.navigator.msSaveBlob(blob1, "Software.json");
                } else {
                    const url = window.URL || window.webkitURL;
                    link = url.createObjectURL(blob1);
                    const a = document.createElement("a");
                    a.download = "Software.json";
                    a.href = link;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }

            }, err => console.log(err.message));
        }
    })

})