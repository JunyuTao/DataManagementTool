const downloadHistoryData = document.querySelector('#downloadHistory')
downloadHistoryData.addEventListener('click', (e) => {
    e.preventDefault()

    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection('maintenance').onSnapshot(snapshot => {
                let maintenance = []
                snapshot.forEach(doc => {

                    maintenance.push({
                        id: doc.id,
                        Tag_Number: doc.data().tag_num,
                        Owner: doc.data().owner,
                        Repairman: doc.data().repairman,
                        Laptop_Version: doc.data().laptop_v,
                        Problem: doc.data().problem,
                        Date_In: doc.data().date_in,
                        Date_Out: doc.data().date_out
                    })
                });

                //Convert JSON Array to string.
                let json = JSON.stringify(maintenance);

                //Convert JSON string to BLOB.
                json = [json];
                let blob1 = new Blob(json, { type: "text/plain;charset=utf-8" });

                //Check the Browser.
                const isIE = false || !!document.documentMode;
                if (isIE) {
                    window.navigator.msSaveBlob(blob1, "maintenance.json");
                } else {
                    const url = window.URL || window.webkitURL;
                    link = url.createObjectURL(blob1);
                    const a = document.createElement("a");
                    a.download = "maintenance.json";
                    a.href = link;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }

            }, err => console.log(err.message));

        }
    })

})