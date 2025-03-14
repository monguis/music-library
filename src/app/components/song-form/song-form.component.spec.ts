import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongFormComponent } from './song-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SongsService } from '../../services/songs/songs.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SongModel } from '../../models/song';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

describe('SongFormComponent', () => {
  let component: SongFormComponent;
  let fixture: ComponentFixture<SongFormComponent>;
  let mockSongsService: jasmine.SpyObj<SongsService>;
  let mockNotificationService: jasmine.SpyObj<NotificationsService>;
  let dialogMock: jasmine.SpyObj<MatDialog>;  
  let mockActivatedRoute: any;
  let routerMock: Router

  beforeEach(async () => {
    mockSongsService = jasmine.createSpyObj('SongsService', ['addSongToLocalList','getSongToUpdate', 'setSongForEdit', 'updateSong', 'addSong', "updateLocalList"]);
    mockNotificationService = jasmine.createSpyObj('NotificationsService', ['pushWarningAlert', 'pushSuccessAlert', 'pushErrorAlert']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    
    mockActivatedRoute = {
      snapshot: {
        url: [{ path: 'create' }],
      },
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SongFormComponent],
      providers: [
        FormBuilder,
        { provide: SongsService, useValue: mockSongsService },
        { provide: NotificationsService, useValue: mockNotificationService },
        { provide: MatDialog, useValue: dialogMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: routerMock}
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("On submit behavior", ()=>{
    it('should call handleCreate when submitting in create mode', () => {
      spyOn(component, 'handleCreate');
      component.songForm.controls['title'].setValue('Test Song');
      component.songForm.controls['artist'].setValue('Test Artist');
      component.songForm.controls['releaseDate'].setValue(new Date());
      component.songForm.controls['price'].setValue(10);
      
      component.submitForm();
      expect(component.handleCreate).toHaveBeenCalled();
    });
  
    it('should show confirmation when submitting a valid dto in update mode', () => {
      component.mode = 'update';

      spyOn(component, 'handleUpdate');
      component.songForm.controls['title'].setValue('Updated Song');
      component.songForm.controls['artist'].setValue('Updated Artist');
      component.songForm.controls['releaseDate'].setValue(new Date());
      component.songForm.controls['price'].setValue(15);
     
     const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
     dialogRefMock.afterClosed.and.returnValue(of('confirm'));
     dialogMock.open.and.returnValue(dialogRefMock);
     
      component.submitForm();
      dialogRefMock.afterClosed().subscribe(() => {
        expect(component.handleUpdate).toHaveBeenCalled();
      });
    });

    it("should update songs service and notify user on successful update", () => {
      
      const validDto = {
        artist: "new",
        title: "song",
        price: 5,
        release_date: "01-01-2020",
        id:"1"
      }
      const validResponse = new SongModel(validDto)
      mockSongsService.updateSong.and.returnValue(of(validResponse))
      component['currentSongId'] = "1"
      component.handleUpdate(validDto)

      expect(mockSongsService.updateLocalList).toHaveBeenCalledWith("1", validResponse)
      expect(mockNotificationService.pushSuccessAlert).toHaveBeenCalledWith('Song ID: 1 has been updated successfully')
      expect(routerMock.navigate).toHaveBeenCalledWith(["/"]);
    })

    it("should notify the user on update error", () => {
      const validDto = {
        artist: "new",
        title: "song",
        price: 5,
        release_date: "01-01-2020",
        id:"1"
      }
      const testErr = "test err"
      mockSongsService.updateSong.and.returnValue(throwError(new Error(testErr)))

      component.handleUpdate(validDto)

      expect(mockNotificationService.pushErrorAlert).toHaveBeenCalledWith(`Song ID:  could not be updated: ${testErr}` )
    })



    it("should update songs service and notify user on successful create", () => {
      
      const validDto = {
        artist: "new",
        title: "song",
        price: 5,
        release_date: "01-01-2020",
        id:"1"
      }
      const validResponse = new SongModel(validDto)
      mockSongsService.addSong.and.returnValue(of(validResponse))
      component.handleCreate(validDto)

      expect(mockSongsService.addSongToLocalList).toHaveBeenCalledWith( validResponse)
      expect(mockNotificationService.pushSuccessAlert).toHaveBeenCalledWith('Song was added successfully')
      expect(routerMock.navigate).toHaveBeenCalledWith(["/"]);
    })

    it("should notify the user on create error", () => {
      const validDto = {
        artist: "new",
        title: "song",
        price: 5,
        release_date: "01-01-2020",
        id:"1"
      }
      const testErr = "test err"
      mockSongsService.addSong.and.returnValue(throwError(new Error(testErr)))

      component.handleCreate(validDto)

      expect(mockNotificationService.pushErrorAlert).toHaveBeenCalledWith(`New song could not be created: ${testErr}` )
    })
  })

  describe("On cancel behavior", () => {
    it("should navigate to home when canceling on create mode",() =>{
      component.mode="create"
     
      component.songForm.controls['title'].setValue('');
      component.songForm.controls['artist'].setValue('');
      component.songForm.controls['releaseDate'].setValue('');
      component.songForm.controls['price'].setValue(null);

      component.onCancel()
      expect(routerMock.navigate).toHaveBeenCalledWith(["/"]);
    })

    it("should navigate to home when form is invalid",() =>{
      component.mode="create"
      component.onCancel()

      expect(routerMock.navigate).toHaveBeenCalledWith(["/"]);
    })

    it("should navigate to home when form is valid mode is updating but changes have not been made", () =>{
      const testId = "1"
      const testSong = new SongModel({
        id: testId,
        title:'Test Song',
        artist:'Test Artist',
        release_date: "01-01-2020",
        price:10,
      })
      
      component.mode="update"
      component['currentSongId'] = testId
      component.songSnapshot = testSong

      component.songForm.controls['title'].setValue(testSong.title);
      component.songForm.controls['artist'].setValue(testSong.artist);
      component.songForm.controls['releaseDate'].setValue(testSong.releaseDate);
      component.songForm.controls['price'].setValue(testSong.price);
      
      component.onCancel()
      
      expect(routerMock.navigate).toHaveBeenCalledWith(["/"]);
    })

    it("should open confirmation modal when form is valid mode is updating and changes been made", () =>{
      const testId = "1"
      const testSong = new SongModel({
        id: testId,
        title:'Test Song',
        artist:'Test Artist',
        release_date: "01-01-2020",
        price:10,
      })
      
      component.mode="update"
      component['currentSongId'] = testId
      component.songSnapshot = testSong

      component.songForm.controls['title'].setValue("New Title");
      component.songForm.controls['artist'].setValue(testSong.artist);
      component.songForm.controls['releaseDate'].setValue(testSong.releaseDate);
      component.songForm.controls['price'].setValue(testSong.price);

      const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefMock.afterClosed.and.returnValue(of('confirm'));
      dialogMock.open.and.returnValue(dialogRefMock);

      component.onCancel()

      const dialogArgs = dialogMock.open.calls.mostRecent().args;
      expect(dialogArgs[0]).toBe(ConfirmationDialogComponent);
      expect(dialogArgs[1]).toEqual({
      data: {
        title: 'Discarding changes',
        message: 'Do you want to continue?',
        },
      });
      
      component.onCancel()
    })

    it("should navigate to home if modal is confirmed", () =>{
      const testId = "1"
      const testSong = new SongModel({
        id: testId,
        title:'Test Song',
        artist:'Test Artist',
        release_date: "01-01-2020",
        price:10,
      })
      
      component.mode="update"
      component['currentSongId'] = testId
      component.songSnapshot = testSong

      component.songForm.controls['title'].setValue("New Title");
      component.songForm.controls['artist'].setValue(testSong.artist);
      component.songForm.controls['releaseDate'].setValue(testSong.releaseDate);
      component.songForm.controls['price'].setValue(testSong.price);

      const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefMock.afterClosed.and.returnValue(of('confirm'));
      dialogMock.open.and.returnValue(dialogRefMock);
      component.onCancel()

      dialogRefMock.afterClosed().subscribe(() => {
        expect(routerMock.navigate).toHaveBeenCalledWith(["/"]);
      });
    })
  })

  describe("On init behavior", () => {
    it('should initialize form with default values', () => {
    expect(component.songForm.value).toEqual({
      title: '',
      artist: '',
      releaseDate: '',
      price: 0,
    });

  });
    it("should navigate to home when modifing a non existing song", () => {
      const testId = "1"

      mockSongsService.getSongToUpdate.and.returnValue(null);
      mockActivatedRoute.snapshot.url[1] = [{ path: testId }]
      
      component.handleFormInitOnUpdate();

      expect(routerMock.navigate).toHaveBeenCalledWith(["/"])
    });

  })

  
  it('should mark form invalid when required fields are empty', () => {
    component.songForm.controls['title'].setValue('');
    component.songForm.controls['artist'].setValue('');
    component.songForm.controls['releaseDate'].setValue('');
    component.songForm.controls['price'].setValue(null);
    expect(component.songForm.invalid).toBeTrue();
  });

  it('should disable submit button if form is invalid', () => {
    expect(component.isFormSubmitDisabled()).toBeTrue();
  });

  describe("On Destroy behavior", () => {
    it("should reset the form to update", () => {
      component.ngOnDestroy()
      expect(mockSongsService.setSongForEdit).toHaveBeenCalledWith(null)
    })
  })
});
